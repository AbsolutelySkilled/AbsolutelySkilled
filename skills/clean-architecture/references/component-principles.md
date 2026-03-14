<!-- Part of the Clean Architecture AbsolutelySkilled skill. Load this file when
     working with component cohesion and coupling principles. -->

# Component Principles

Components are the units of deployment - the smallest things that can be deployed
as part of a system. In different languages these are jars, gems, npm packages, DLLs,
or Go modules. The component principles guide what goes into each component and how
components relate to each other.

---

## Component Cohesion (what goes together)

These three principles are in tension with each other. You balance them based on
project maturity.

### REP - Reuse/Release Equivalence Principle

> The granule of reuse is the granule of release.

Classes and modules that are grouped into a component should be releasable together.
If they're reused together, they should be versioned together.

**Practical meaning:** Don't put unrelated classes in the same package just because
they're "utilities." If someone depends on your component for class A, they
shouldn't be forced to accept changes to unrelated class B.

**Violation:** A `utils` package containing string helpers, date formatters, HTTP
clients, and logging wrappers. A change to the HTTP client forces a new release
that string-helper consumers must adopt.

**Fix:** Split into `string-utils`, `http-client`, `logger` packages that can
be versioned independently.

### CCP - Common Closure Principle

> Gather into components those classes that change for the same reasons and at
> the same times. Separate into different components those classes that change
> at different times and for different reasons.

This is SRP for components. When a requirement changes, you want the change
concentrated in as few components as possible.

**Practical meaning:** If two classes always change together (same pull request,
same sprint), they belong in the same component. If they change independently,
separate them.

**Example:** `OrderValidator` and `OrderPricer` both change when business rules
about orders change. Put them in the same `order-rules` component.
`OrderValidator` and `EmailFormatter` change for different reasons. Separate them.

### CRP - Common Reuse Principle

> Don't force users of a component to depend on things they don't need.

When someone depends on your component, they depend on the whole thing. Every
class in that component is a potential source of change that affects all consumers.

**Practical meaning:** If only 2 of 10 classes in a component are used by a
consumer, the other 8 are unnecessary coupling. Split the component so consumers
only depend on what they actually use.

**This is ISP for components.**

### Balancing the three

```
         REP
        /    \
      /        \
    CCP -------- CRP
```

- **Early in development:** Favor CCP (convenience of co-location). You're
  changing things rapidly and want minimal components to modify.
- **As the system matures:** Shift toward REP and CRP (independent releases,
  minimal coupling). Consumers need stable, focused components.
- **The tension is permanent.** You're always choosing which principle to relax.
  Acknowledge the trade-off explicitly.

---

## Component Coupling (how they relate)

### ADP - Acyclic Dependencies Principle

> Allow no cycles in the component dependency graph.

If component A depends on B, and B depends on C, and C depends on A, you have
a cycle. Cycles mean:
- You can't build/test components independently
- Changes cascade unpredictably
- Release order becomes impossible to determine

**Detection:** Draw the dependency graph. If you can't topologically sort it,
there's a cycle.

**Breaking cycles - two strategies:**

1. **Dependency Inversion** - If A depends on B and B depends on A, extract an
   interface. Make B depend on an interface that A implements.

```
Before:  A -> B -> A  (cycle)

After:   A -> B -> InterfaceX (interface, owned by B)
         A implements InterfaceX
```

2. **Extract a new component** - Move the shared dependency into a new component
   that both A and B depend on.

```
Before:  A -> B -> A  (cycle)

After:   A -> C
         B -> C
```

### SDP - Stable Dependencies Principle

> Depend in the direction of stability.

A component that is depended on by many other components is stable - it has many
reasons not to change. A component that depends on many others is unstable - it
has many reasons to change.

**Depend on the stable things.** Don't make a stable component depend on a
volatile one.

**Stability metric (I):**

```
I = Fan-out / (Fan-in + Fan-out)

Fan-in:  number of components that depend on this one
Fan-out: number of components this one depends on

I = 0: maximally stable (everyone depends on it, it depends on nothing)
I = 1: maximally unstable (it depends on everything, nothing depends on it)
```

The Dependency Rule naturally aligns with SDP: entities (I=0, maximally stable)
are depended on by use cases, which are depended on by adapters, which are
depended on by frameworks (I=1, maximally unstable).

### SAP - Stable Abstractions Principle

> A component should be as abstract as it is stable.

Stable components (low I) should be abstract - composed mainly of interfaces
and abstract classes. This makes them open for extension even though they're
hard to change.

Unstable components (high I) should be concrete - they're easy to change, so
they don't need the protection of abstraction.

**Abstractness metric (A):**

```
A = Number of abstract classes and interfaces / Total number of classes

A = 0: fully concrete
A = 1: fully abstract
```

**The Main Sequence:** Plot components on an I vs A graph. The ideal is the
line from (0, 1) to (1, 0) - stable things are abstract, unstable things are
concrete. Distance from this line indicates design problems:

- **Zone of Pain** (0, 0) - Stable and concrete. Hard to change but depended on
  by everything. Example: a concrete utility library everyone imports.
- **Zone of Uselessness** (1, 1) - Unstable and abstract. Interfaces nobody
  implements. Dead abstraction.

---

## Practical component organization

For a typical Clean Architecture project:

| Component | Stability (I) | Abstractness (A) | Contains |
|---|---|---|---|
| `domain` | ~0 (stable) | High (interfaces + entities) | Entities, value objects, domain interfaces |
| `application` | ~0.3 | Medium (use case interfaces) | Use cases, input/output ports |
| `infrastructure` | ~0.7 | Low (concrete) | Database, HTTP, messaging implementations |
| `main` / `bootstrap` | 1.0 (unstable) | 0 (concrete) | Composition root, wiring, config |

This naturally follows the Main Sequence and aligns with the Dependency Rule.

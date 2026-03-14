<!-- Part of the ios-swift AbsolutelySkilled skill. Load this file when
     working with UIKit view controllers, Auto Layout, collection views,
     or coordinator patterns. -->

# UIKit Patterns

## View Controller Lifecycle

Methods are called in this order:

```
init(coder:) or init(nibName:bundle:)
  -> loadView()
  -> viewDidLoad()           // one-time setup: add subviews, constraints
  -> viewWillAppear(_:)      // about to appear: refresh data, start animations
  -> viewIsAppearing(_:)     // iOS 13+: view has traits and geometry
  -> viewDidAppear(_:)       // fully visible: start timers, analytics
  -> viewWillDisappear(_:)   // about to leave: pause media, save draft
  -> viewDidDisappear(_:)    // fully gone: cancel network, release resources
  -> deinit                  // verify this is called (no retain cycles)
```

### Common mistakes

- Doing layout work in `viewDidLoad` when geometry is not yet final - use `viewDidLayoutSubviews` or `viewIsAppearing`
- Not calling `super` for lifecycle methods
- Putting one-time setup in `viewWillAppear` (called every time the view appears)

---

## Auto Layout

### Programmatic constraints

```swift
class CustomViewController: UIViewController {
    private let titleLabel = UILabel()
    private let actionButton = UIButton(type: .system)

    override func viewDidLoad() {
        super.viewDidLoad()
        setupViews()
    }

    private func setupViews() {
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        actionButton.translatesAutoresizingMaskIntoConstraints = false

        view.addSubview(titleLabel)
        view.addSubview(actionButton)

        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            titleLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            titleLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),

            actionButton.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 24),
            actionButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
        ])
    }
}
```

### Key rules

- Always set `translatesAutoresizingMaskIntoConstraints = false` for programmatic constraints
- Use `safeAreaLayoutGuide` for top/bottom to avoid notch and home indicator
- Use `layoutMarginsGuide` for consistent horizontal padding
- Activate constraints in batches with `NSLayoutConstraint.activate([])` for performance
- Set content hugging and compression resistance priorities to resolve ambiguity

### Intrinsic content size priorities

```swift
// Label should not stretch beyond its text
titleLabel.setContentHuggingPriority(.required, for: .horizontal)
// Label should not be compressed
titleLabel.setContentCompressionResistancePriority(.required, for: .horizontal)
```

---

## UICollectionView Compositional Layout

The modern way to build complex collection views (iOS 13+).

```swift
func createLayout() -> UICollectionViewLayout {
    // Item
    let itemSize = NSCollectionLayoutSize(
        widthDimension: .fractionalWidth(0.5),
        heightDimension: .fractionalHeight(1.0)
    )
    let item = NSCollectionLayoutItem(layoutSize: itemSize)
    item.contentInsets = NSDirectionalEdgeInsets(top: 4, leading: 4, bottom: 4, trailing: 4)

    // Group
    let groupSize = NSCollectionLayoutSize(
        widthDimension: .fractionalWidth(1.0),
        heightDimension: .absolute(200)
    )
    let group = NSCollectionLayoutGroup.horizontal(layoutSize: groupSize, subitems: [item])

    // Section
    let section = NSCollectionLayoutSection(group: group)
    section.contentInsets = NSDirectionalEdgeInsets(top: 8, leading: 8, bottom: 8, trailing: 8)

    // Header
    let headerSize = NSCollectionLayoutSize(
        widthDimension: .fractionalWidth(1.0),
        heightDimension: .estimated(44)
    )
    let header = NSCollectionLayoutBoundarySupplementaryItem(
        layoutSize: headerSize,
        elementKind: UICollectionView.elementKindSectionHeader,
        alignment: .top
    )
    section.boundarySupplementaryItems = [header]

    return UICollectionViewCompositionalLayout(section: section)
}
```

### Diffable Data Source (iOS 13+)

```swift
var dataSource: UICollectionViewDiffableDataSource<Section, Item>!

dataSource = UICollectionViewDiffableDataSource(collectionView: collectionView) {
    collectionView, indexPath, item in
    let cell = collectionView.dequeueReusableCell(
        withReuseIdentifier: "ItemCell",
        for: indexPath
    ) as! ItemCell
    cell.configure(with: item)
    return cell
}

// Apply snapshot
var snapshot = NSDiffableDataSourceSnapshot<Section, Item>()
snapshot.appendSections([.main])
snapshot.appendItems(items)
dataSource.apply(snapshot, animatingDifferences: true)
```

---

## Coordinator Pattern

Decouple navigation logic from view controllers.

```swift
protocol Coordinator: AnyObject {
    var childCoordinators: [Coordinator] { get set }
    var navigationController: UINavigationController { get }
    func start()
}

class AppCoordinator: Coordinator {
    var childCoordinators: [Coordinator] = []
    let navigationController: UINavigationController

    init(navigationController: UINavigationController) {
        self.navigationController = navigationController
    }

    func start() {
        let vc = HomeViewController()
        vc.coordinator = self
        navigationController.pushViewController(vc, animated: false)
    }

    func showDetail(for item: Item) {
        let detailVC = DetailViewController(item: item)
        detailVC.coordinator = self
        navigationController.pushViewController(detailVC, animated: true)
    }
}

class HomeViewController: UIViewController {
    weak var coordinator: AppCoordinator?

    func didSelectItem(_ item: Item) {
        coordinator?.showDetail(for: item)
    }
}
```

---

## UIKit + SwiftUI Interop

### Hosting SwiftUI in UIKit

```swift
let swiftUIView = MySwiftUIView(model: model)
let hostingController = UIHostingController(rootView: swiftUIView)

// As a child view controller
addChild(hostingController)
view.addSubview(hostingController.view)
hostingController.view.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    hostingController.view.topAnchor.constraint(equalTo: view.topAnchor),
    hostingController.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
    hostingController.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
    hostingController.view.bottomAnchor.constraint(equalTo: view.bottomAnchor),
])
hostingController.didMove(toParent: self)
```

### Table view and collection view cells with SwiftUI (iOS 16+)

```swift
cell.contentConfiguration = UIHostingConfiguration {
    HStack {
        Image(systemName: item.icon)
        Text(item.title)
    }
    .padding()
}
```

---

## Delegate and Protocol Patterns

```swift
protocol ItemSelectionDelegate: AnyObject {
    func didSelectItem(_ item: Item)
    func didDeselectItem(_ item: Item)
}

class ItemListViewController: UIViewController {
    weak var delegate: ItemSelectionDelegate?  // Always weak to prevent retain cycles

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let item = items[indexPath.row]
        delegate?.didSelectItem(item)
    }
}
```

Always declare delegates as `weak var` to prevent retain cycles between the delegate and the delegating object.

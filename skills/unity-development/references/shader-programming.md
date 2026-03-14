<!-- Part of the Unity Development AbsolutelySkilled skill. Load this file when working with Unity shader authoring - ShaderLab, HLSL, Shader Graph, URP/HDRP shaders, or GPU instancing. -->

# Shader Programming Reference

---

## 1. Render Pipeline Compatibility

Shaders are pipeline-specific. A shader written for Built-in won't work in URP/HDRP.

| Pipeline | Shader Language | Include Path | Lit Base Shader |
|---|---|---|---|
| Built-in | CG/HLSL | `UnityCG.cginc` | `Standard` |
| URP | HLSL | `Packages/com.unity.render-pipelines.universal/ShaderLibrary/` | `Universal Render Pipeline/Lit` |
| HDRP | HLSL | `Packages/com.unity.render-pipelines.high-definition/Runtime/ShaderLibrary/` | `HDRP/Lit` |

**Rule:** Check which pipeline the project uses before writing any shader code.
URP is the most common choice for cross-platform games.

---

## 2. ShaderLab Structure

Every Unity shader follows the ShaderLab wrapper format:

```hlsl
Shader "Category/ShaderName"
{
    Properties
    {
        // Exposed to Inspector and material API
        _PropertyName ("Display Name", Type) = DefaultValue
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" "Queue"="Geometry" }
        Pass
        {
            // Shader program goes here (HLSL or CG)
        }
    }
    FallBack "Diffuse"  // fallback if hardware can't run this shader
}
```

**Property types:**

| ShaderLab Type | C# Type | Example |
|---|---|---|
| `Color` | `Color` | `_Color ("Tint", Color) = (1,1,1,1)` |
| `Float` | `float` | `_Glossiness ("Smooth", Range(0,1)) = 0.5` |
| `2D` | `Texture2D` | `_MainTex ("Albedo", 2D) = "white" {}` |
| `Vector` | `Vector4` | `_Wind ("Wind Dir", Vector) = (1,0,0,0)` |
| `Int` | `int` | `_Stencil ("Stencil", Int) = 0` |

---

## 3. URP Lit Shader from Scratch

A complete URP-compatible lit shader with diffuse + normal mapping:

```hlsl
Shader "Custom/URPLit"
{
    Properties
    {
        _BaseMap ("Albedo", 2D) = "white" {}
        _BaseColor ("Color", Color) = (1,1,1,1)
        _BumpMap ("Normal Map", 2D) = "bump" {}
        _BumpScale ("Normal Scale", Float) = 1.0
        _Metallic ("Metallic", Range(0,1)) = 0.0
        _Smoothness ("Smoothness", Range(0,1)) = 0.5
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" "RenderPipeline"="UniversalPipeline" "Queue"="Geometry" }

        Pass
        {
            Name "ForwardLit"
            Tags { "LightMode"="UniversalForward" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile _ _MAIN_LIGHT_SHADOWS
            #pragma multi_compile _ _ADDITIONAL_LIGHTS

            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            struct Attributes
            {
                float4 positionOS : POSITION;
                float3 normalOS   : NORMAL;
                float4 tangentOS  : TANGENT;
                float2 uv         : TEXCOORD0;
            };

            struct Varyings
            {
                float4 positionCS : SV_POSITION;
                float2 uv         : TEXCOORD0;
                float3 positionWS : TEXCOORD1;
                float3 normalWS   : TEXCOORD2;
                float3 tangentWS  : TEXCOORD3;
                float3 bitangentWS: TEXCOORD4;
            };

            TEXTURE2D(_BaseMap);    SAMPLER(sampler_BaseMap);
            TEXTURE2D(_BumpMap);    SAMPLER(sampler_BumpMap);

            CBUFFER_START(UnityPerMaterial)
                float4 _BaseMap_ST;
                float4 _BaseColor;
                float  _BumpScale;
                float  _Metallic;
                float  _Smoothness;
            CBUFFER_END

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                VertexPositionInputs posInputs = GetVertexPositionInputs(IN.positionOS.xyz);
                VertexNormalInputs normInputs = GetVertexNormalInputs(IN.normalOS, IN.tangentOS);

                OUT.positionCS  = posInputs.positionCS;
                OUT.positionWS  = posInputs.positionWS;
                OUT.uv          = TRANSFORM_TEX(IN.uv, _BaseMap);
                OUT.normalWS    = normInputs.normalWS;
                OUT.tangentWS   = normInputs.tangentWS;
                OUT.bitangentWS = normInputs.bitangentWS;
                return OUT;
            }

            half4 frag(Varyings IN) : SV_Target
            {
                half4 albedo = SAMPLE_TEXTURE2D(_BaseMap, sampler_BaseMap, IN.uv) * _BaseColor;
                half3 normalTS = UnpackNormalScale(
                    SAMPLE_TEXTURE2D(_BumpMap, sampler_BumpMap, IN.uv), _BumpScale);
                half3 normalWS = TransformTangentToWorld(normalTS,
                    half3x3(IN.tangentWS, IN.bitangentWS, IN.normalWS));

                InputData inputData = (InputData)0;
                inputData.positionWS = IN.positionWS;
                inputData.normalizedScreenSpaceUV = GetNormalizedScreenSpaceUV(IN.positionCS);
                inputData.normalWS = normalize(normalWS);
                inputData.viewDirectionWS = GetWorldSpaceNormalizeViewDir(IN.positionWS);

                SurfaceData surfaceData = (SurfaceData)0;
                surfaceData.albedo = albedo.rgb;
                surfaceData.metallic = _Metallic;
                surfaceData.smoothness = _Smoothness;
                surfaceData.alpha = albedo.a;

                return UniversalFragmentPBR(inputData, surfaceData);
            }
            ENDHLSL
        }
    }
}
```

---

## 4. Shader Graph

Shader Graph is the node-based visual shader editor. Preferred for:
- Artists who don't write HLSL
- Rapid prototyping of visual effects
- Shaders that need frequent iteration

**Key nodes:**

| Node | Purpose |
|---|---|
| Sample Texture 2D | Read a texture at UV coordinates |
| Fresnel Effect | Edge glow / rim lighting |
| Noise (Gradient/Simple/Voronoi) | Procedural patterns |
| Lerp | Blend between two values |
| Time | Animate properties |
| UV | Access/modify texture coordinates |
| Normal Vector | Surface normal in world/object/tangent space |
| Custom Function | Embed raw HLSL for operations Shader Graph can't express |

**Custom Function node pattern:**

```hlsl
// Create a .hlsl file, reference it in Custom Function node
void MyCustomFunction_float(float3 In, out float3 Out)
{
    Out = In * 0.5 + 0.5;  // remap -1..1 to 0..1
}
```

---

## 5. SRP Batcher Compatibility

The SRP Batcher reduces draw call overhead by batching materials that share the
same shader variant. To be compatible:

1. All per-material properties must be inside `CBUFFER_START(UnityPerMaterial)`
2. All per-object built-in properties must be inside `CBUFFER_START(UnityPerDraw)`
3. Do not use `MaterialPropertyBlock` (it breaks SRP Batcher for that renderer)

Check compatibility in Frame Debugger > SRP Batcher column.

---

## 6. GPU Instancing

For rendering many copies of the same mesh (trees, rocks, grass):

```hlsl
#pragma multi_compile_instancing

// In vertex shader
UNITY_SETUP_INSTANCE_ID(IN);
UNITY_TRANSFER_INSTANCE_ID(IN, OUT);

// Per-instance properties
UNITY_INSTANCING_BUFFER_START(Props)
    UNITY_DEFINE_INSTANCED_PROP(float4, _Color)
UNITY_INSTANCING_BUFFER_END(Props)

// Access in fragment
half4 col = UNITY_ACCESS_INSTANCED_PROP(Props, _Color);
```

**When to use instancing vs SRP Batcher:**
- SRP Batcher: different materials, same shader variant (default, always prefer)
- GPU Instancing: same material + mesh, per-instance property variation
- Both: can't coexist on the same draw call; SRP Batcher takes priority

---

## 7. Common Shader Techniques

### Dissolve Effect

```hlsl
// In Properties
_DissolveAmount ("Dissolve", Range(0,1)) = 0
_DissolveTex ("Dissolve Noise", 2D) = "white" {}

// In fragment
half noise = SAMPLE_TEXTURE2D(_DissolveTex, sampler_DissolveTex, IN.uv).r;
clip(noise - _DissolveAmount);  // discard pixel if below threshold
```

### Scrolling UV (Water, Lava)

```hlsl
float2 scrolledUV = IN.uv + _Time.y * _ScrollSpeed;
half4 tex = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, scrolledUV);
```

### Rim Lighting / Fresnel

```hlsl
float3 viewDir = normalize(_WorldSpaceCameraPos - IN.positionWS);
float rim = 1.0 - saturate(dot(viewDir, IN.normalWS));
rim = pow(rim, _RimPower);
half3 rimColor = rim * _RimColor.rgb;
```

### Vertex Displacement (Wind)

```hlsl
// In vertex shader
float wave = sin(_Time.y * _WindSpeed + IN.positionOS.x * _WindFrequency);
OUT.positionCS = TransformObjectToHClip(
    IN.positionOS.xyz + float3(wave * _WindStrength, 0, 0));
```

---

## 8. Debugging Shaders

| Tool | Purpose |
|---|---|
| Frame Debugger | Inspect every draw call, see shader state |
| RenderDoc | GPU-level debugging, shader stepping |
| Shader compilation errors | Check Console; line numbers reference the HLSL block |
| `#pragma enable_d3d11_debug_symbols` | Add debug info for RenderDoc |
| Output solid color | Replace frag return with `return half4(1,0,0,1)` to verify the shader runs |
| Visualize normals | `return half4(IN.normalWS * 0.5 + 0.5, 1)` |

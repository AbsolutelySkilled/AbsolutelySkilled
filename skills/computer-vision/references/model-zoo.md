<!-- Part of the computer-vision AbsolutelySkilled skill. Load this file when
     selecting a model architecture or comparing pretrained options. -->

# Computer Vision Model Zoo

## Image Classification Backbones

| Model | Params | ImageNet Top-1 | Latency (A100, bs=1) | Pretrained weights | Best for |
|---|---|---|---|---|---|
| ResNet-50 | 25 M | 76.1 % | ~3 ms | `torchvision` / timm | Baseline, feature extractor |
| ResNet-101 | 45 M | 77.4 % | ~5 ms | `torchvision` / timm | Higher accuracy vs R50 |
| EfficientNet-B0 | 5.3 M | 77.1 % | ~2 ms | `torchvision` / timm | Mobile, low FLOP |
| EfficientNet-B4 | 19 M | 83.4 % | ~7 ms | `torchvision` / timm | Accuracy/speed sweet spot |
| EfficientNet-B7 | 66 M | 84.4 % | ~20 ms | `torchvision` / timm | Max accuracy, constrained deploy |
| ConvNeXt-Tiny | 28 M | 82.1 % | ~4 ms | `torchvision` / timm | Modern CNN, easy fine-tuning |
| ConvNeXt-Base | 89 M | 83.8 % | ~9 ms | `torchvision` / timm | Strong general baseline |
| ViT-B/16 | 86 M | 81.1 % | ~6 ms | timm / HuggingFace | Attention maps, large data |
| ViT-L/16 | 307 M | 82.5 % | ~18 ms | timm / HuggingFace | Highest accuracy, data-hungry |
| DINOv2-ViT-B/14 | 86 M | 84.5 % (linear) | ~7 ms | HuggingFace `facebook/dinov2-base` | Few-shot, dense features |
| DINOv2-ViT-L/14 | 307 M | 86.3 % (linear) | ~20 ms | HuggingFace `facebook/dinov2-large` | Best self-supervised features |

### Loading pretrained weights

```python
import timm

# List available models
timm.list_models("efficientnet*", pretrained=True)

# Load any timm model
model = timm.create_model("efficientnet_b4", pretrained=True, num_classes=0)  # feature extractor
cfg = model.default_cfg  # contains input size, mean, std
```

---

## Object Detection Models

| Model | Backbone | COCO mAP | FPS (A100) | Weights source | Notes |
|---|---|---|---|---|---|
| YOLOv5n | CSPDarknet | 28.0 | 1200 | Ultralytics | Smallest YOLO, edge deploy |
| YOLOv5s | CSPDarknet | 37.4 | 600 | Ultralytics | |
| YOLOv5m | CSPDarknet | 45.4 | 300 | Ultralytics | |
| YOLOv5l | CSPDarknet | 49.0 | 180 | Ultralytics | |
| YOLOv8n | C2f | 37.3 | 1300 | Ultralytics | Anchor-free, cleaner API |
| YOLOv8s | C2f | 44.9 | 700 | Ultralytics | |
| YOLOv8m | C2f | 50.2 | 300 | Ultralytics | |
| YOLOv8l | C2f | 52.9 | 180 | Ultralytics | |
| YOLO11n | C3k2 | 39.5 | 1400 | Ultralytics | Latest generation, default choice |
| YOLO11s | C3k2 | 47.0 | 750 | Ultralytics | |
| YOLO11m | C3k2 | 51.5 | 350 | Ultralytics | |
| YOLO11l | C3k2 | 53.4 | 200 | Ultralytics | |
| YOLO11x | C3k2 | 54.7 | 100 | Ultralytics | |
| RT-DETR-L | ResNet-101 | 53.0 | 110 | Ultralytics / HuggingFace | Transformer, no NMS needed |
| DETR | ResNet-50 | 42.0 | 60 | HuggingFace | Foundational transformer detector |
| Faster R-CNN R50 | ResNet-50 | 37.0 | 50 | `torchvision` | Two-stage, high-precision |

### Model selection heuristics

- **Edge / mobile** (Jetson Nano, mobile CPU): YOLO11n or YOLOv5n; use INT8 TensorRT export.
- **Server real-time** (>20 FPS on single GPU): YOLO11s or YOLO11m.
- **Maximum accuracy, offline**: YOLO11x or RT-DETR-L.
- **Unusual aspect ratios or dense small objects**: Consider tiled inference with YOLO.
- **No NMS tuning wanted**: RT-DETR removes post-processing sensitivity to IoU threshold.

---

## Semantic Segmentation Models

| Model | Backbone | mIoU (Cityscapes) | mIoU (ADE20K) | Weights source | Notes |
|---|---|---|---|---|---|
| DeepLabV3 R50 | ResNet-50 | 73.5 | - | `torchvision` | Solid baseline |
| DeepLabV3+ R101 | ResNet-101 | 78.9 | - | `torchvision` | Atrous spatial pyramid |
| SegFormer-B0 | MiT-B0 | 76.2 | 37.4 | HuggingFace `nvidia/segformer-b0` | Lightweight transformer |
| SegFormer-B2 | MiT-B2 | 81.0 | 46.5 | HuggingFace `nvidia/segformer-b2` | Best efficiency/accuracy |
| SegFormer-B5 | MiT-B5 | 84.0 | 51.8 | HuggingFace `nvidia/segformer-b5` | Highest accuracy |
| Mask2Former | Swin-B | - | 53.9 | HuggingFace `facebook/mask2former-swin-base-ade-semantic` | Universal segmentation |
| U-Net (custom) | ResNet/EfficientNet | varies | varies | timm encoder | Medical / satellite, custom scale |

---

## Instance Segmentation Models

| Model | COCO mask AP | Weights source | Notes |
|---|---|---|---|
| YOLO11n-seg | 30.7 | Ultralytics | Fastest, edge |
| YOLO11m-seg | 40.8 | Ultralytics | Balanced |
| YOLO11x-seg | 43.8 | Ultralytics | Best accuracy |
| Mask R-CNN R50 | 34.6 | `torchvision` | Classic two-stage |
| SAM (ViT-B) | - | Meta / HuggingFace | Promptable, zero-shot masks |
| SAM (ViT-H) | - | Meta / HuggingFace | Highest quality, slow |

### SAM quickstart

```python
from transformers import SamModel, SamProcessor
import torch

model = SamModel.from_pretrained("facebook/sam-vit-base").to("cuda")
processor = SamProcessor.from_pretrained("facebook/sam-vit-base")

# Point prompt
inputs = processor(images=image_pil, input_points=[[[x, y]]], return_tensors="pt").to("cuda")
with torch.no_grad():
    outputs = model(**inputs)
masks = processor.image_processor.post_process_masks(
    outputs.pred_masks.cpu(), inputs["original_sizes"].cpu(), inputs["reshaped_input_sizes"].cpu()
)
```

---

## Foundation / Zero-shot Models

| Model | Task | Weights source | Notes |
|---|---|---|---|
| CLIP ViT-B/32 | Image-text matching | `openai/clip-vit-base-patch32` | Zero-shot classification |
| CLIP ViT-L/14 | Image-text matching | `openai/clip-vit-large-patch14` | Better accuracy |
| OpenCLIP ViT-H/14 | Image-text matching | HuggingFace `laion/CLIP-ViT-H-14-laion2B` | Open weights, LAION trained |
| Grounding DINO | Open-vocab detection | HuggingFace `IDEA-Research/grounding-dino-base` | Text-prompted detection |
| OWL-ViT | Open-vocab detection | HuggingFace `google/owlvit-base-patch32` | Few-shot detection |

### CLIP zero-shot classification

```python
from transformers import CLIPProcessor, CLIPModel

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

labels = ["a cat", "a dog", "a car"]
inputs = processor(text=labels, images=image_pil, return_tensors="pt", padding=True)
with torch.no_grad():
    logits = model(**inputs).logits_per_image  # [1, num_labels]
probs = logits.softmax(dim=1)
predicted = labels[probs.argmax()]
```

---

## Pretrained Weight Sources

| Source | URL | Notes |
|---|---|---|
| torchvision | `torchvision.models` | Official PyTorch models |
| timm | `pip install timm` / HuggingFace | 1000+ models, consistent API |
| Ultralytics | `ultralytics.com` / `pip install ultralytics` | YOLO family |
| HuggingFace Hub | `huggingface.co/models` | SegFormer, SAM, CLIP, DINOv2 |
| Meta Research | GitHub releases | SAM, DINOv2 native checkpoints |
| ONNX Model Zoo | `github.com/onnx/models` | Ready-to-deploy ONNX weights |

---

## Hardware Considerations

| Scenario | Recommended approach |
|---|---|
| Training on single GPU (<=8 GB) | EfficientNet-B0/B2 or YOLO11n/s; use AMP (`torch.cuda.amp`) |
| Training on multi-GPU | `torch.nn.parallel.DistributedDataParallel`; YOLO11 `device=0,1,2,3` |
| Inference on CPU only | Export to ONNX; use OpenVINO for Intel, XNNPACK for ARM |
| Inference on Jetson (edge GPU) | Export to TensorRT FP16/INT8 with `trtexec` or `torch2trt` |
| Inference on Apple Silicon | Use `mps` device (`torch.device("mps")`); CoreML export for on-device |
| Cloud serving (throughput) | TensorRT on T4/A10G; batch size 8-32; dynamic shape engines |

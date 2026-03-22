<!-- Part of the video-analyzer AbsolutelySkilled skill. Load this file when
     working with advanced FFmpeg filter graphs for motion analysis, thumbnail
     generation, video comparison, color extraction, or complex pipelines. -->

# FFmpeg Recipes

Advanced FFmpeg recipes for video analysis tasks. Load this file only when the
task requires patterns beyond basic frame extraction and scene detection.

---

## Motion vectors visualization

Visualize motion vectors to understand camera movement and object motion.

```bash
# Render motion vectors as overlay on video
ffmpeg -flags2 +export_mvs -i input.mp4 \
  -vf "codecview=mv=pf+bf+bb" \
  motion_vectors.mp4

# Extract motion vectors to text (requires custom build with debug)
ffmpeg -flags2 +export_mvs -i input.mp4 \
  -vf "codecview=mv=pf+bf+bb,showinfo" \
  -f null - 2>&1 | grep "showinfo"
```

---

## Thumbnail sheet generation

Create a single image containing evenly spaced thumbnails from the video.

```bash
# Generate a 4x4 thumbnail grid
ffmpeg -i input.mp4 \
  -vf "fps=1/30,scale=320:180,tile=4x4" \
  -frames:v 1 \
  thumbnail_sheet.png

# Generate thumbnail grid from first 2 minutes
ffmpeg -i input.mp4 -t 120 \
  -vf "fps=1/15,scale=320:180,tile=4x4" \
  -frames:v 1 \
  preview_sheet.png

# Generate individual thumbnails at fixed size
ffmpeg -i input.mp4 \
  -vf "fps=1/10,scale=160:90" \
  -q:v 2 \
  thumbs/thumb_%04d.jpg
```

---

## Video comparison (side by side)

Compare two videos or a video against a reference frame.

```bash
# Side by side comparison of two videos
ffmpeg -i video_a.mp4 -i video_b.mp4 \
  -filter_complex "[0:v]scale=960:540[left];[1:v]scale=960:540[right];[left][right]hstack" \
  comparison.mp4

# Stack vertically for resolution comparison
ffmpeg -i original.mp4 -i compressed.mp4 \
  -filter_complex "[0:v]scale=1920:540[top];[1:v]scale=1920:540[bottom];[top][bottom]vstack" \
  vcompare.mp4

# Difference between two videos (highlights changes)
ffmpeg -i video_a.mp4 -i video_b.mp4 \
  -filter_complex "[0:v][1:v]blend=all_mode=difference" \
  diff.mp4
```

---

## Color analysis

Extract dominant colors and color distribution from video frames.

```bash
# Extract histogram data for a single frame
ffmpeg -i input.mp4 -ss 00:00:30 -frames:v 1 \
  -vf "histogram=display_mode=overlay" \
  histogram.png

# Generate color palette from a frame (creates a 16-color palette)
ffmpeg -i input.mp4 -ss 00:00:30 -frames:v 1 \
  -vf "palettegen=max_colors=16:stats_mode=full" \
  palette.png

# Generate palette from entire video (averages across all frames)
ffmpeg -i input.mp4 \
  -vf "palettegen=max_colors=16:stats_mode=full" \
  video_palette.png

# Extract average color per frame as text
ffmpeg -i input.mp4 \
  -vf "scale=1:1,showinfo" \
  -f null - 2>&1 | grep "color"
```

---

## Frame rate and speed analysis

Analyze and manipulate video timing.

```bash
# Show frame timestamps and durations
ffmpeg -i input.mp4 \
  -vf "showinfo" \
  -f null - 2>&1 | grep "showinfo" | head -50

# Detect variable frame rate issues
ffprobe -v error \
  -select_streams v:0 \
  -show_entries frame=pkt_pts_time,pkt_duration_time \
  -of csv=p=0 \
  input.mp4 | head -20

# Check for dropped frames by analyzing pts gaps
ffprobe -v error \
  -select_streams v:0 \
  -show_entries frame=pkt_pts_time \
  -of csv=p=0 \
  input.mp4 > frame_times.csv
```

---

## Crop detection

Automatically detect black bars or letterboxing.

```bash
# Detect crop values (runs for 60 seconds of video)
ffmpeg -i input.mp4 -t 60 \
  -vf "cropdetect=24:16:0" \
  -f null - 2>&1 | grep "cropdetect" | tail -5

# Apply detected crop
ffmpeg -i input.mp4 \
  -vf "crop=1920:800:0:140" \
  cropped.mp4
```

---

## Interlace detection

Detect if video content is interlaced.

```bash
# Detect interlacing
ffmpeg -i input.mp4 -t 30 \
  -vf "idet" \
  -f null - 2>&1 | grep "idet"

# Check with ffprobe
ffprobe -v error \
  -select_streams v:0 \
  -show_entries stream=field_order \
  -of default=noprint_wrappers=1:nokey=1 \
  input.mp4
```

---

## Multi-pass analysis pipeline

Complex analysis combining multiple FFmpeg passes.

```bash
# Pass 1: Extract scene timestamps
ffmpeg -i input.mp4 \
  -vf "select='gt(scene,0.3)',showinfo" \
  -f null - 2>&1 | grep pts_time | \
  sed 's/.*pts_time:\([0-9.]*\).*/\1/' > scene_times.txt

# Pass 2: Extract frame at each scene timestamp
mkdir -p scene_frames
counter=1
while IFS= read -r timestamp; do
  ffmpeg -ss "$timestamp" -i input.mp4 \
    -frames:v 1 -q:v 2 \
    "scene_frames/scene_$(printf '%04d' $counter).jpg" \
    -y 2>/dev/null
  counter=$((counter + 1))
done < scene_times.txt

# Pass 3: Generate thumbnail sheet from scene frames
ffmpeg -framerate 1 -pattern_type glob \
  -i "scene_frames/scene_*.jpg" \
  -vf "scale=320:180,tile=5x4" \
  -frames:v 1 \
  scene_overview.png
```

---

## Audio-visual sync analysis

Detect synchronization issues between audio and video.

```bash
# Extract audio peaks (loud moments)
ffmpeg -i input.mp4 \
  -af "astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.Peak_level" \
  -f null - 2>&1 | grep "Peak_level" > audio_peaks.txt

# Extract visual change moments
ffmpeg -i input.mp4 \
  -vf "select='gt(scene,0.3)',showinfo" \
  -f null - 2>&1 | grep "pts_time" > visual_changes.txt

# Compare timestamps to detect sync drift
# (manual comparison of the two files above)
```

---

## Segment extraction

Extract specific segments for detailed analysis.

```bash
# Extract a time range (from 1:30 to 2:45)
ffmpeg -i input.mp4 -ss 00:01:30 -to 00:02:45 \
  -c copy segment.mp4

# Extract first 30 seconds
ffmpeg -i input.mp4 -t 30 -c copy first_30s.mp4

# Split video into equal segments
ffmpeg -i input.mp4 \
  -f segment -segment_time 60 \
  -c copy \
  segments/segment_%03d.mp4

# Extract segment around a specific timestamp (10 seconds before/after)
ffmpeg -i input.mp4 -ss 00:05:20 -t 20 \
  -c copy context_clip.mp4
```

---

## Bitrate analysis

Analyze bitrate distribution across the video.

```bash
# Show bitrate per frame
ffprobe -v error \
  -select_streams v:0 \
  -show_entries frame=pkt_size,pkt_pts_time \
  -of csv=p=0 \
  input.mp4 > bitrate_data.csv

# Get average and max bitrate
ffprobe -v error \
  -show_entries format=bit_rate \
  -of default=noprint_wrappers=1:nokey=1 \
  input.mp4

# Stream-specific bitrate
ffprobe -v error \
  -select_streams v:0 \
  -show_entries stream=bit_rate,max_bit_rate \
  -of json \
  input.mp4
```

---

## Useful filter combinations

Common filter chains for analysis workflows.

```bash
# Extract frames with burned-in timestamps
ffmpeg -i input.mp4 \
  -vf "drawtext=text='%{pts\:hms}':fontsize=24:fontcolor=white:x=10:y=10,fps=1" \
  frames_with_time/frame_%04d.png

# Extract frames with frame number overlay
ffmpeg -i input.mp4 \
  -vf "drawtext=text='Frame %{n}':fontsize=24:fontcolor=white:x=10:y=10,fps=1" \
  frames_numbered/frame_%04d.png

# Scale down before extraction (faster, smaller files)
ffmpeg -i input.mp4 \
  -vf "scale=640:-1,fps=1" \
  -q:v 3 \
  small_frames/frame_%04d.jpg

# Extract frames with deinterlacing
ffmpeg -i input.mp4 \
  -vf "yadif,fps=1" \
  deinterlaced/frame_%04d.png
```

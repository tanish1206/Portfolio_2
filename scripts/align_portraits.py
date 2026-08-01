import os
import cv2
import numpy as np

# Directory paths
PORTRAITS_DIR = r"d:\Portfolio_2\Portfolio_2\public\portraits"
OUTPUT_DIR = os.path.join(PORTRAITS_DIR, "aligned")
os.makedirs(OUTPUT_DIR, exist_ok=True)

IMAGE_FILES = [
    "builder2.jpeg",
    "hackathon builder2.png",
    "full stack engineer2.jpeg",
    "ai engineer2.jpeg",
    "founder2.jpeg"
]

# Load OpenCV cascades
face_cascade_path = os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml")
eye_cascade_path = os.path.join(cv2.data.haarcascades, "haarcascade_eye.xml")

face_cascade = cv2.CascadeClassifier(face_cascade_path)
eye_cascade = cv2.CascadeClassifier(eye_cascade_path)

def detect_eyes(image_path):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not load image: {image_path}")
    
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Equalize histogram for consistent detection
    gray_eq = cv2.equalizeHist(gray)
    
    faces = face_cascade.detectMultiScale(gray_eq, scaleFactor=1.05, minNeighbors=4, minSize=(80, 80))
    
    if len(faces) == 0:
        # Fallback to upper center box
        fx, fy, fw, fh = int(w * 0.25), int(h * 0.15), int(w * 0.50), int(h * 0.50)
    else:
        # Pick face closest to center
        faces = sorted(faces, key=lambda f: abs((f[0] + f[2]/2) - w/2) + abs((f[1] + f[3]/2) - h/3))
        fx, fy, fw, fh = faces[0]
    
    # Search for eyes in upper half of detected face ROI
    roi_gray = gray_eq[fy:fy + int(fh * 0.55), fx:fx + fw]
    eyes = eye_cascade.detectMultiScale(roi_gray, scaleFactor=1.05, minNeighbors=3, minSize=(25, 25))
    
    if len(eyes) >= 2:
        # Filter and pick 2 most horizontal eyes
        eyes = sorted(eyes, key=lambda e: e[0])
        left_eye_rect = eyes[0]
        right_eye_rect = eyes[-1]
        
        left_eye = (fx + left_eye_rect[0] + left_eye_rect[2] / 2.0, fy + left_eye_rect[1] + left_eye_rect[3] / 2.0)
        right_eye = (fx + right_eye_rect[0] + right_eye_rect[2] / 2.0, fy + right_eye_rect[1] + right_eye_rect[3] / 2.0)
    else:
        # Fallback based on face geometry (standard eye positions)
        left_eye = (fx + fw * 0.33, fy + fh * 0.38)
        right_eye = (fx + fw * 0.67, fy + fh * 0.38)
        
    return left_eye, right_eye, img

print("--- Step 1: Detect Eye Landmarks ---")
landmarks = {}
for filename in IMAGE_FILES:
    path = os.path.join(PORTRAITS_DIR, filename)
    left_eye, right_eye, img = detect_eyes(path)
    h, w = img.shape[:2]
    eye_center = ((left_eye[0] + right_eye[0]) / 2.0, (left_eye[1] + right_eye[1]) / 2.0)
    eye_dist = np.hypot(right_eye[0] - left_eye[0], right_eye[1] - left_eye[1])
    landmarks[filename] = {
        "left_eye": left_eye,
        "right_eye": right_eye,
        "center": eye_center,
        "dist": eye_dist,
        "shape": (w, h),
        "img": img
    }
    print(f"[{filename:30s}] Left Eye: ({left_eye[0]:.1f}, {left_eye[1]:.1f}), Right Eye: ({right_eye[0]:.1f}, {right_eye[1]:.1f}), Inter-eye Dist: {eye_dist:.2f}px, Shape: {w}x{h}")

# Reference image: builder2.jpeg
ref_name = "builder2.jpeg"
ref = landmarks[ref_name]
target_w, target_h = ref["shape"]
target_center = ref["center"]
target_dist = ref["dist"]

print(f"\n--- Step 2: Affine Alignment to Reference ({ref_name}) ---")
print(f"Target Eye Center: ({target_center[0]:.1f}, {target_center[1]:.1f}), Target Inter-eye Distance: {target_dist:.2f}px")

for filename in IMAGE_FILES:
    data = landmarks[filename]
    img = data["img"]
    l_eye = data["left_eye"]
    r_eye = data["right_eye"]
    
    # Calculate angle & scale
    dY = r_eye[1] - l_eye[1]
    dX = r_eye[0] - l_eye[0]
    angle = np.degrees(np.arctan2(dY, dX))
    
    current_dist = data["dist"]
    scale = target_dist / current_dist if current_dist > 0 else 1.0
    
    eye_center = (float(data["center"][0]), float(data["center"][1]))
    
    # Get 2D Rotation Matrix centered on current eye center
    M = cv2.getRotationMatrix2D(eye_center, angle, scale)
    
    # Translate so current eye center maps to target eye center
    M[0, 2] += (target_center[0] - eye_center[0])
    M[1, 2] += (target_center[1] - eye_center[1])
    
    aligned_img = cv2.warpAffine(img, M, (target_w, target_h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    
    output_path = os.path.join(OUTPUT_DIR, filename)
    cv2.imwrite(output_path, aligned_img)
    print(f"[OK] Saved aligned portrait: {output_path}")

print("\nAll 5 portraits successfully aligned to common eye-line and inter-eye spacing!")


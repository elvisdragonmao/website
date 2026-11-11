"""Export the approved, packed Blender master; no reconstruction or external files."""
import bpy, hashlib, json, sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
source = root / "assets/character/source.blend"
destination = root / "assets/character/source.glb"
if "--output" in sys.argv:
    destination = Path(sys.argv[sys.argv.index("--output") + 1]).resolve()
bpy.ops.wm.open_mainfile(filepath=str(source))
images = [image for image in bpy.data.images if image.source == "FILE"]
assert len(images) == 5 and all(image.packed_file for image in images), "Master must contain five packed textures"
meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
assert len(meshes) == 1 and "Blink" in meshes[0].data.shape_keys.key_blocks
meshes[0].data.shape_keys.key_blocks["Blink"].value = 0
for obj in bpy.context.scene.objects:
    if obj.type == "ARMATURE":
        for bone in obj.pose.bones:
            bone.matrix_basis.identity()
bpy.context.view_layer.update()
bpy.ops.object.select_all(action="DESELECT")
for obj in bpy.context.scene.objects:
    if obj.type in {"MESH", "ARMATURE", "EMPTY"}:
        obj.select_set(True)
destination.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(destination), export_format="GLB", use_selection=True,
    export_yup=True, export_apply=False, export_animations=False, export_extras=True)
assert destination.stat().st_size > 0
print("EXPORTED_CHARACTER", json.dumps({"output": str(destination), "bytes": destination.stat().st_size,
    "sha256": hashlib.sha256(destination.read_bytes()).hexdigest()}))

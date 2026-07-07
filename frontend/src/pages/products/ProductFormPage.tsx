import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Container,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import API from "../../services/api";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useTranslation } from "react-i18next";


const ProductFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    cost: 0,
    stock: 0,
    category: "general",
    isActive: true,
  });

  // FIX: Split image state into existing URLs and newly selected File objects
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<
    Array<{ file: File; preview: string }>
  >([]);
  // FIX: Track the total byte size of selected image files to pre-validate before submit
  const [imageUploadSize, setImageUploadSize] = useState(0);

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/products/${id}`);
        const p = res.data.data?.product || res.data;
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || 0,
          cost: p.cost || 0,
          stock: p.stock || 0,
          category: p.category || "general",
          isActive: p.isActive ?? true,
        });
        setExistingImages(p.images || []);
        setNewImageFiles([]);
      } catch (err) {
        console.error(err);
        alert(t("products.form.loadError"));
      } finally {
        setFetching(false);
      }
    };
    loadProduct();
  }, [id]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };

  // FIX: Accept File objects and validate sizes instead of converting to Base64 strings
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxTotalBytes = 10 * 1024 * 1024;
    const maxFileBytes = 5 * 1024 * 1024;
    const currentBytes = newImageFiles.reduce(
      (sum, item) => sum + item.file.size,
      0
    );
    const selectedBytes = files.reduce((sum, file) => sum + file.size, 0);

    if (files.some((file) => file.size > maxFileBytes)) {
      alert(t("products.form.imageMaxSize"));
      return;
    }

    if (currentBytes + selectedBytes > maxTotalBytes) {
      alert(t("products.form.imagesMaxTotalSize"));
      return;
    }

    const nextFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImageFiles((prev) => [...prev, ...nextFiles]);
    setImageUploadSize(currentBytes + selectedBytes);
  };

  // FIX: Remove image either from existing URL list or from newly selected files
  const removeImage = (index: number, isExisting = false) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    setNewImageFiles((prev) => {
      const removed = prev[index];
      const next = prev.filter((_, i) => i !== index);
      if (removed) URL.revokeObjectURL(removed.preview);
      setImageUploadSize(next.reduce((sum, item) => sum + item.file.size, 0));
      return next;
    });
  };

  // FIX: Submit using multipart/form-data with files in `images` field and keep `imageUrls` for existing URLs
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", String(form.price));
      formData.append("cost", String(form.cost));
      formData.append("stock", String(form.stock));
      formData.append("category", form.category);
      formData.append("isActive", String(form.isActive));
      formData.append("imageUrls", JSON.stringify(existingImages));

      newImageFiles.forEach((image) => {
        formData.append("images", image.file);
      });

      if (isEdit) {
        await API.put(`/products/${id}`, formData);
      } else {
        await API.post("/products", formData);
      }

      navigate("/app/products");
    } catch (err: any) {
  console.error("SAVE ERROR:", err);

  console.log(
    "SERVER RESPONSE:",
    err?.response?.data
  );

  alert(
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    t("products.form.saveError")
  );
} finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 4 } }}>
        <SkeletonLoader count={5} height={40} />
      </Box>
    );
  }

 return (
  <Box
    sx={{
      minHeight: "100vh",
      py: { xs: 2, md: 4 },
      px: { xs: 2, md: 0 },
    }}
  >
    <Container maxWidth="lg">

      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
          pb: 3,
          borderBottom: "2px solid #e0e7ff",
        }}
      >
        <Box>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 900,
              margin: 0,
              color: "#fff",
            }}
          >
            {isEdit ? (
              <>
                {t("products.form.editTitle")} <span style={{ color: "#6366f1" }}>{t("products.form.product")}</span>
              </>
            ) : (
              <>
                {t("products.form.newTitle")} <span style={{ color: "#6366f1" }}>{t("products.form.product")}</span>
              </>
            )}
          </h1>

          <p
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              marginTop: "0.5rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {t("products.form.subtitle")}
          </p>
        </Box>
      </Box>

      {/* GALLERY PREVIEW */}
      <Card sx={{ mb: 4 }}>
        <CardHeader 
          title={t("products.form.gallery")} 
          subheader={t("products.form.galleryDescription", { count: existingImages.length + newImageFiles.length, size: formatBytes(imageUploadSize) })}
          action={
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
            >
              {t("products.form.addImages")}
              <input
                hidden
                type="file"
                multiple
                accept="image/*"
                onChange={handleImage}
              />
            </Button>
          }
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              minHeight: existingImages.length + newImageFiles.length > 0 ? "auto" : 100,
              alignItems: "center",
              justifyContent: existingImages.length + newImageFiles.length > 0 ? "flex-start" : "center",
              border: "2px dashed #e2e8f0",
              borderRadius: 2,
              p: 2
            }}
          >
            {existingImages.length + newImageFiles.length === 0 && (
              <Typography color="text.secondary">{t("products.form.noImages")}</Typography>
            )}
           {existingImages.map((img, index) => (
           <Box key={`existing-${index}`}>
           <img
            src={img}
            alt={`preview-${index}`}
            style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 8,
            }}
          />
           </Box>
          ))}
            {newImageFiles.map((image, index) => (
              <Box key={`new-${index}`} sx={{ position: "relative", width: 120, height: 120 }}>
                <img
                  src={image.preview}
                  alt={`preview-new-${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeImage(index, false)}
                  sx={{ position: "absolute", top: -10, right: -10, bgcolor: "white", "&:hover": { bgcolor: "#f1f1f1" } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* KPI PREVIEW */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="overline">
                {t("products.form.currentPrice")}
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: 'primary.main' }}
              >
                ${form.price || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="overline">
                {t("products.form.stock")}
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: 900 }}
              >
                {form.stock}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="overline">
                {t("products.form.status")}
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Chip
                  label={
                    form.isActive
                      ? t("products.form.active")
                      : t("products.form.inactive")
                  }
                  color={
                    form.isActive
                      ? "success"
                      : "default"
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit}>

        {/* INFORMACIÓN GENERAL */}
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title={t("products.form.generalInfo")}
            subheader={t("products.form.generalInfoDescription")}
          />

          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  label={t("products.form.name")}
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t("products.form.description")}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* INFORMACIÓN COMERCIAL */}
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title={t("products.form.businessInfo")}
            subheader={t("products.form.businessInfoDescription")}
          />

          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t("products.form.price")}
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: Number(e.target.value),
                    })
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t("products.form.cost")}
                  value={form.cost}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cost: Number(e.target.value),
                    })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
  <TextField
    fullWidth
    type="number"
    label={t("products.form.stock")}
    value={form.stock}
    onChange={(e) =>
      setForm({
        ...form,
        stock: Number(e.target.value),
      })
    }
  />
</Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>
                    {t("products.form.category")}
                  </InputLabel>

                  <Select
                    value={form.category}
                    label={t("products.form.category")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category:
                          e.target.value,
                      })
                    }
                  >
                   <MenuItem value="general">
                      {t("products.form.categories.general")}
                   </MenuItem>

                  <MenuItem value="electronics">
                     {t("products.form.categories.electronics")}
                  </MenuItem>

                  <MenuItem value="office">
                     {t("products.form.categories.office")}
                   </MenuItem>

                  <MenuItem value="services">
                     {t("products.form.categories.services")}
                   </MenuItem>

                 <MenuItem value="clothing">
                    {t("products.form.categories.clothing")}
                 </MenuItem>

                 <MenuItem value="footwear">
                   {t("products.form.categories.footwear")}
                 </MenuItem>

                 <MenuItem value="food">
                   {t("products.form.categories.food")}
                 </MenuItem>

                 <MenuItem value="beverages">
                   {t("products.form.categories.beverages")}
                 </MenuItem>

                 <MenuItem value="grocery">
                   {t("products.form.categories.grocery")}
                 </MenuItem>

                 <MenuItem value="health">
                   {t("products.form.categories.health")}
                 </MenuItem>

                 <MenuItem value="beauty">
                   {t("products.form.categories.beauty")}
                 </MenuItem>

                 <MenuItem value="home">
                   {t("products.form.categories.home")}
                 </MenuItem>

                 <MenuItem value="furniture">
                  {t("products.form.categories.furniture")}
                 </MenuItem>

                 <MenuItem value="sports">
                  {t("products.form.categories.sports")}
                </MenuItem>

                  <MenuItem value="toys">
                      {t("products.form.categories.toys")}
                  </MenuItem>

                  <MenuItem value="automotive">
                      {t("products.form.categories.automotive")}
                     </MenuItem>

                   <MenuItem value="hardware">
                      {t("products.form.categories.hardware")}
                   </MenuItem>

                     <MenuItem value="construction">
                       {t("products.form.categories.construction")}
                     </MenuItem>

                   <MenuItem value="books">
                         {t("products.form.categories.books")}
                    </MenuItem>

                  <MenuItem value="pets">
                      {t("products.form.categories.pets")}
                 </MenuItem>

                <MenuItem value="jewelry">
                         {t("products.form.categories.jewelry")}
                   </MenuItem>

                <MenuItem value="accessories">
                     {t("products.form.categories.accessories")}
                </MenuItem>

                <MenuItem value="technology">
                  {t("products.form.categories.technology")}
                </MenuItem>

                <MenuItem value="cleaning">
                    {t("products.form.categories.cleaning")}
                 </MenuItem>

                <MenuItem value="pharmacy">
                    {t("products.form.categories.pharmacy")}
                </MenuItem>

              <MenuItem value="other">
                   {t("products.form.categories.other")}
                </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

            </Grid>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            sx={{ fontSize: 14, textTransform: 'none', color: 'white' }} 
            startIcon={<CancelIcon />}
            onClick={() =>
              navigate("/app/products")
            }
          >
            {t("products.form.cancel")}
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading
              ? t("products.form.saving")
              : isEdit
              ? t("products.form.updateProduct")
              : t("products.form.createProduct")}
          </Button>
        </Box>
      </form>
    </Container>
  </Box>
);
};
export default ProductFormPage;
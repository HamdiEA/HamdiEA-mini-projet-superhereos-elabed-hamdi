import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Hero } from '../types/Hero';
import { Upload, X } from 'lucide-react';

interface HeroFormProps {
  hero?: Hero;
  onSubmit: (values: any) => void;
  isLoading?: boolean;
}

const HeroForm: React.FC<HeroFormProps> = ({ hero, onSubmit, isLoading = false }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    hero?.image || null
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const validationSchema = Yup.object({
    nom: Yup.string()
      .required('Le nom est requis')
      .min(2, 'Le nom doit contenir au moins 2 caractères')
      .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
    alias: Yup.string()
      .required('L\'alias est requis')
      .min(2, 'L\'alias doit contenir au moins 2 caractères')
      .max(50, 'L\'alias ne peut pas dépasser 50 caractères'),
    univers: Yup.string()
      .required('L\'univers est requis')
      .oneOf(['Marvel', 'DC', 'Autre'], 'Veuillez choisir un univers valide'),
    pouvoirs: Yup.string()
      .required('Les pouvoirs sont requis')
      .test('pouvoirs', 'Veuillez entrer au moins un pouvoir', (value) => {
        if (!value) return false;
        const pouvoirs = value.split(',').map(p => p.trim()).filter(p => p);
        return pouvoirs.length > 0;
      }),
    description: Yup.string()
      .required('La description est requise')
      .min(10, 'La description doit contenir au moins 10 caractères'),
    origine: Yup.string()
      .required('L\'origine est requise')
      .min(2, 'L\'origine doit contenir au moins 2 caractères'),
    premiereApparition: Yup.string()
      .required('La première apparition est requise')
      .min(2, 'La première apparition doit contenir au moins 2 caractères'),
  });

  const formik = useFormik({
    initialValues: {
      nom: hero?.nom || '',
      alias: hero?.alias || '',
      univers: hero?.univers || '',
      pouvoirs: hero?.pouvoirs.join(', ') || '',
      description: hero?.description || '',
      origine: hero?.origine || '',
      premiereApparition: hero?.premiereApparition || '',
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(values).forEach(key => {
        if (key === 'pouvoirs') {
          // Convert pouvoirs string back to array
          const pouvoirsArray = values.pouvoirs
            .split(',')
            .map(p => p.trim())
            .filter(p => p);
          formData.append(key, JSON.stringify(pouvoirsArray));
        } else {
          formData.append(key, values[key as keyof typeof values]);
        }
      });
      
      // Add image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      onSubmit(formData);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setSelectedImage(null);
    formik.setFieldValue('image', '');
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="form-label">Image du héros</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="image-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Télécharger une image</span>
                <input
                  id="image-upload"
                  name="image"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              <p className="pl-1">ou glisser-déposer</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
          </div>
        </div>
      </div>

      {/* Name and Alias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nom" className="form-label">
            Nom du héros *
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            className="form-input"
            value={formik.values.nom}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.nom && formik.errors.nom && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.nom}</p>
          )}
        </div>

        <div>
          <label htmlFor="alias" className="form-label">
            Alias *
          </label>
          <input
            id="alias"
            name="alias"
            type="text"
            className="form-input"
            value={formik.values.alias}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.alias && formik.errors.alias && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.alias}</p>
          )}
        </div>
      </div>

      {/* Universe */}
      <div>
        <label htmlFor="univers" className="form-label">
          Univers *
        </label>
        <select
          id="univers"
          name="univers"
          className="form-input"
          value={formik.values.univers}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Sélectionner un univers</option>
          <option value="Marvel">Marvel</option>
          <option value="DC">DC</option>
          <option value="Autre">Autre</option>
        </select>
        {formik.touched.univers && formik.errors.univers && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.univers}</p>
        )}
      </div>

      {/* Powers */}
      <div>
        <label htmlFor="pouvoirs" className="form-label">
          Pouvoirs * (séparés par des virgules)
        </label>
        <input
          id="pouvoirs"
          name="pouvoirs"
          type="text"
          placeholder="Ex: Super force, Vol, Intelligence"
          className="form-input"
          value={formik.values.pouvoirs}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.pouvoirs && formik.errors.pouvoirs && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.pouvoirs}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="form-label">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="form-input"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.description && formik.errors.description && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
        )}
      </div>

      {/* Origin and First Appearance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="origine" className="form-label">
            Origine *
          </label>
          <input
            id="origine"
            name="origine"
            type="text"
            className="form-input"
            value={formik.values.origine}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.origine && formik.errors.origine && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.origine}</p>
          )}
        </div>

        <div>
          <label htmlFor="premiereApparition" className="form-label">
            Première apparition *
          </label>
          <input
            id="premiereApparition"
            name="premiereApparition"
            type="text"
            placeholder="Ex: Amazing Fantasy #15 (1962)"
            className="form-input"
            value={formik.values.premiereApparition}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.premiereApparition && formik.errors.premiereApparition && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.premiereApparition}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enregistrement...' : hero ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

export default HeroForm;
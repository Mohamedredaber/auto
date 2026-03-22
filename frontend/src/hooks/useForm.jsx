import { useState, useCallback } from "react";

export const useForm = ({ initialValues = {}, validate = () => ({}), onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors]         = useState({});
  const [touched, setTouched]       = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runValidation = useCallback(
    (vals) => validate(vals),
    [validate]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...values, [name]: value };
    setValues(updated);
    if (touched[name]) setErrors(runValidation(updated));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const updated = { ...values, [name]: value };
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(runValidation(updated));
  };
  const setFieldValue = (field, value) => {
    const updated = { ...values, [field]: value };
    setValues(updated);
    if (touched[field]) setErrors(runValidation(updated));
  };

  const setFieldTouched = (field, isTouched = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tout marquer comme touché pour afficher toutes les erreurs
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }), {}
    );
    setTouched(allTouched);

    const validationErrors = runValidation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
        setLoading(false);
      }
    }
  };

  const isValid = Object.keys(errors).length === 0;

  return {
    values, errors, touched,
    isSubmitting, isValid,loading,
    handleChange, handleBlur, handleSubmit,
    setFieldValue, setFieldTouched,
    setErrors, resetForm,
  };
};
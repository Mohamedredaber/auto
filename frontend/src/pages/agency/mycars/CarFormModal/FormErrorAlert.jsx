// components/cars/form/FormErrorAlert.jsx
const FormErrorAlert = ({ errors }) => {
  if (!errors) return null;

  const errorList = errors?.errors
    ? Object.values(errors.errors).flat()
    : errors?.message
    ? [errors.message]
    : [];

  if (errorList.length === 0) return null;

  return (
    <div
      style={{
        background: "var(--color-error-bg)",
        border: "1px solid var(--color-error)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-3) var(--space-4)",
        marginBottom: "var(--space-4)",
      }}
    >
      <p
        style={{
          color: "var(--color-error)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--weight-semibold)",
          marginBottom: errorList.length > 1 ? "var(--space-2)" : 0,
        }}
      >
        {errorList.length > 1 ? "Erreurs de validation :" : errorList[0]}
      </p>
      {errorList.length > 1 && (
        <ul style={{ paddingLeft: "var(--space-4)", margin: 0 }}>
          {errorList.map((err, i) => (
            <li
              key={i}
              style={{
                color: "var(--color-error)",
                fontSize: "var(--text-sm)",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              {err}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormErrorAlert;
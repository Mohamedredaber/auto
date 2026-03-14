import { useState, useRef } from "react";
import * as Icon from "../../../components/layout/icons";

export function InputField({ label, id, name, type = "text", placeholder, icon, value, onChange, onBlur, error, optional }) {
    const [show, setShow] = useState(false);
    const isPass = type === "password";
    const actualType = isPass ? (show ? "text" : "password") : type;

    return (
        <div className="rp-group">
            <label className="rp-label" htmlFor={id}>
                {label}{optional && <span style={{ color: "var(--muted)", fontWeight: 400, textTransform: "none", marginLeft: 4 }}>(optionnel)</span>}
            </label>
            <div className="rp-input-wrap">
                {icon && <span className="rp-icon">{icon}</span>}
                <input
                    id={id}
                    name={name}
                    type={actualType}
                    className={`rp-input${!icon ? " no-icon" : ""}${error ? " err" : ""}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoComplete="off"
                />
                {isPass && (
                    <span className="rp-icon rp-icon-r" onClick={() => setShow(s => !s)}>
                        {show ? <Icon.EyeOff /> : <Icon.Eye />}
                    </span>
                )}
            </div>
            {error && (
                <span className="rp-errmsg show">
                    <Icon.Error /> {error}
                </span>
            )}
        </div>
    );
}

export function PasswordStrength({ password }) {
    if (!password) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const colors = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
    const labels = ["Très faible", "Moyen", "Fort", "Très fort"];
    return (
        <div style={{ marginTop: 6 }}>
            <div className="rp-strength">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rp-strength-seg" style={{ background: i <= score ? colors[score - 1] : "var(--border)" }} />
                ))}
            </div>
            <div className="rp-strength-lbl" style={{ color: colors[score - 1] || "var(--muted)" }}>
                {labels[score - 1] || ""}
            </div>
        </div>
    );
}

export function SelectField({ label, id, name, icon, value, onChange, onBlur, options, error }) {
    return (
        <div className="rp-group">
            <label className="rp-label" htmlFor={id}>{label}</label>
            <div className="rp-input-wrap">
                {icon && <span className="rp-icon">{icon}</span>}
                <select
                    id={id}
                    name={name}
                    className={`rp-select${error ? " err" : ""}`}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                >
                    <option value="">Sélectionner</option>
                    {options.map(o => <option key={o}>{o}</option>)}
                </select>
            </div>
            {error && <span className="rp-errmsg show"><Icon.Error /> {error}</span>}
        </div>
    );
}

export function UploadLogo({ file, onChange }) {
    const ref = useRef();
    const [preview, setPreview] = useState(null);

    const handleChange = e => {
        const f = e.target.files[0];
        if (!f) return;
        setPreview(URL.createObjectURL(f));
        onChange(f);
    };

    return (
        <div className={`rp-upload${file ? " has-file" : ""}`} onClick={() => ref.current.click()}>
            <input ref={ref} type="file" accept="image/*" onChange={handleChange} onClick={e => e.stopPropagation()} />
            {!preview ? (
                <>
                    <div className="rp-upload-icon"><Icon.Upload /></div>
                    <div className="rp-upload-title"><span>Cliquez</span> ou glissez votre logo</div>
                    <div className="rp-upload-sub">PNG, JPG, SVG · Max 2MB</div>
                </>
            ) : (
                <div className="rp-upload-preview">
                    <img src={preview} alt="logo" />
                    <div>
                        <div className="rp-upload-preview-name">{file?.name}</div>
                        <div className="rp-upload-sub" style={{ color: "var(--green)" }}>Logo chargé ✓</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function PasswordInputInternal({ id, name, value, onChange, onBlur, error }) {
    const [show, setShow] = useState(false);
    return (
        <>
            <input
                id={id}
                name={name}
                type={show ? "text" : "password"}
                className={`rp-input${error ? " err" : ""}`}
                placeholder="••••••••"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
            />
            <span className="rp-icon rp-icon-r" onClick={() => setShow(s => !s)}>
                {show ? <Icon.EyeOff /> : <Icon.Eye />}
            </span>
        </>
    );
}

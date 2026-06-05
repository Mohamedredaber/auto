import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { sendContactMessage, resetContactState } from '../../features/contactSlice';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

const Contact = () => {
  const dispatch = useDispatch();

  // ✅ Renommé clairement pour éviter tout conflit
  const { sending, success, errors: serverErrors } = useSelector(s => s.contact);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm();

  useEffect(() => {
    if (success) {
      reset();
      const t = setTimeout(() => dispatch(resetContactState()), 5000);
      return () => clearTimeout(t);
    }
  }, [success, reset, dispatch]);

  const onSubmit = (data) => dispatch(sendContactMessage(data));

  // ✅ Fonction sécurisée pour afficher les erreurs serveur
  const formatServerErrors = (errs) => {
    if (!errs) return null;
    if (typeof errs === 'string') return errs;
    if (typeof errs === 'object') return Object.values(errs).flat().join(', ');
    return 'Une erreur est survenue.';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-2">Contactez-nous</h1>
      <p className="text-gray-400 text-sm mb-8">Notre équipe vous répond sous 24h.</p>

      {success && (
        <div className="flex items-center gap-3 bg-green-900/30 border border-green-700 text-green-400 rounded-lg p-4 mb-6">
          <CheckCircle className="w-5 h-5 shrink-0" />
          Message envoyé ! Vérifiez votre email pour la confirmation.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nom *</label>
            <input
              {...register('name', { required: 'Nom requis' })}
              className="contact-input"
              placeholder="Mohamed Reda"
            />
            {formErrors.name && (
              <p className="text-red-400 text-xs mt-1">{formErrors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email *</label>
            <input
              {...register('email', {
                required: 'Email requis',
                pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' },
              })}
              className="contact-input"
              placeholder="reda@email.com"
              type="email"
            />
            {formErrors.email && (
              <p className="text-red-400 text-xs mt-1">{formErrors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Sujet</label>
          <input
            {...register('subject')}
            className="contact-input"
            placeholder="Objet de votre message"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Message *</label>
          <textarea
            {...register('message', {
              required: 'Message requis',
              minLength: { value: 10, message: 'Min 10 caractères' },
            })}
            className="contact-input min-h-[140px] resize-none"
            placeholder="Décrivez votre demande..."
          />
          {formErrors.message && (
            <p className="text-red-400 text-xs mt-1">{formErrors.message.message}</p>
          )}
        </div>

        {/* ✅ Utilise serverErrors au lieu de errors */}
        {serverErrors && (
          <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-3">
            {formatServerErrors(serverErrors)}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? 'Envoi en cours...' : 'Envoyer le message'}
        </button>
      </form>
    </div>
  );
};

export default Contact;
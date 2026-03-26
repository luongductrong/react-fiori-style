import { toast } from '@/libs/toast';
import { Controller, useForm } from 'react-hook-form';
import { Toast } from '@ui5/webcomponents-react/Toast';
import { useAppStore } from '@/stores/app-stores';

type LoginFormValues = {
  username: string;
  password: string;
  language: string;
  client: string;
  role: string;
};

const LANGUAGE_OPTIONS = [
  { value: 'vi', label: 'VI - Viet Nam' },
  { value: 'en', label: 'EN - English' },
  { value: 'de', label: 'DE - Deutsch' },
];

export function HomeView() {
  const [showToast, setShowToast] = React.useState(false);
  const setCurrentUserRole = useAppStore((state) => state.setCurrentUserRole);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: '',
      password: '',
      language: 'vi',
      client: '3xx',
        role: 'USER',
    },
  });

  const onSubmit = (_values: LoginFormValues) => {
    toast('This function is not implemented yet.');
  const onSubmit = (values: LoginFormValues) => {
    setCurrentUserRole(values.role === 'ADMIN' ? 'ADMIN' : 'USER');
    setShowToast(true);
    return;
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,#d9eafb_0%,#dceaf7_44%,#e1ecf6_100%)] text-[#16314d]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.16),transparent_35%),linear-gradient(320deg,rgba(255,255,255,0.14),transparent_42%)] opacity-95" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0_14%,transparent_14%_100%)]" />
        <div className="absolute -left-32 -top-8 h-176 w-176 rotate-24 rounded-[42%_58%_51%_49%/46%_39%_61%_54%] bg-white/20" />
        <div className="absolute left-1/2 -top-88 h-208 w-208 -translate-x-1/2 rounded-[54%_46%_39%_61%/40%_55%_45%_60%] bg-white/20" />
        <div className="absolute -bottom-8 -right-32 h-136 w-3xl rotate-28 rounded-[60%_40%_47%_53%/38%_48%_52%_62%] bg-white/20" />
      </div>

      <header
        className="absolute left-[1.1rem] top-[0.95rem] z-10 inline-flex items-center gap-[0.55rem]"
        aria-label="System brand"
      >
        <div className="hidden flex-col leading-none text-[#16507b] sm:flex">
          <strong className="text-[0.74rem] font-bold">SAP Digital</strong>
          <span className="text-[0.66rem] opacity-80">Gateway Access</span>
        </div>
      </header>

      <section className="relative z-10 grid min-h-screen place-items-center px-6 pb-16 pt-20">
        <div className="w-full max-w-88 rounded-[0.9rem] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.48),rgba(255,255,255,0.22))] px-4 pb-4 pt-[1.15rem] shadow-[0_18px_48px_rgba(113,144,176,0.2),inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md sm:px-[1.35rem] sm:pb-[1.1rem] sm:pt-[1.4rem]">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-1 flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="sr-only">User</span>
                <Controller
                  control={control}
                  name="username"
                  rules={{ required: 'User is required.' }}
                  render={({ field }) => (
                    <input
                      aria-label="User"
                      autoComplete="username"
                      className="w-full rounded-[0.55rem] border border-white/55 bg-white/75 px-3 py-[0.72rem] text-sm text-[#16314d] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] outline-none transition focus:border-[#5a8db8] focus:bg-white"
                      name={field.name}
                      placeholder="User"
                      value={field.value}
                      onChange={(event) => {
                        field.onChange(event.target.value);
                      }}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                {errors.username ? (
                  <span className="mt-1 inline-block text-[0.72rem] text-[#b00]">{errors.username.message}</span>
                ) : null}
              </label>

              <label className="flex flex-col gap-1">
                <span className="sr-only">Password</span>
                <Controller
                  control={control}
                  name="password"
                  rules={{ required: 'Password is required.' }}
                  render={({ field }) => (
                    <input
                      aria-label="Password"
                      autoComplete="current-password"
                      className="w-full rounded-[0.55rem] border border-white/55 bg-white/75 px-3 py-[0.72rem] text-sm text-[#16314d] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] outline-none transition focus:border-[#5a8db8] focus:bg-white"
                      name={field.name}
                      placeholder="Password"
                      type="password"
                      value={field.value}
                      onChange={(event) => {
                        field.onChange(event.target.value);
                      }}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                {errors.password ? (
                  <span className="mt-1 inline-block text-[0.72rem] text-[#b00]">{errors.password.message}</span>
                ) : null}
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-[#1d2e45]">Language</span>
                <Controller
                  control={control}
                  name="language"
                  render={({ field }) => (
                    <select
                      aria-label="Language"
                      className="w-full rounded-[0.55rem] border border-white/55 bg-white/75 px-3 py-[0.72rem] text-sm text-[#16314d] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] outline-none transition focus:border-[#5a8db8] focus:bg-white"
                      value={field.value}
                      onChange={(event) => {
                        field.onChange(event.target.value);
                      }}
                    >
                      {LANGUAGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="sr-only">Client</span>
                <Controller
                  control={control}
                  name="client"
                  rules={{
                    required: 'Client is required.',
                    pattern: {
                      value: /^[0-9]{3}$/,
                      message: 'Client must have exactly 3 digits.',
                    },
                  }}
                  render={({ field }) => (
                    <input
                      aria-label="Client"
                      className="w-full rounded-[0.55rem] border border-white/55 bg-white/75 px-3 py-[0.72rem] text-sm text-[#16314d] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] outline-none transition focus:border-[#5a8db8] focus:bg-white"
                      inputMode="numeric"
                      maxLength={3}
                      name={field.name}
                      placeholder="Client"
                      value={field.value}
                      onChange={(event) => {
                        const nextValue = event.target.value.replace(/\D/g, '');
                        field.onChange(nextValue);
                      }}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                {errors.client ? (
                  <span className="mt-1 inline-block text-[0.72rem] text-[#b00]">{errors.client.message}</span>
                ) : null}
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-[#1d2e45]">Role</span>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <select
                      aria-label="Role"
                      className="w-full rounded-[0.55rem] border border-white/55 bg-white/75 px-3 py-[0.72rem] text-sm text-[#16314d] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] outline-none transition focus:border-[#5a8db8] focus:bg-white"
                      value={field.value}
                      onChange={(event) => {
                        field.onChange(event.target.value);
                      }}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  )}
                />
              </label>
            </div>

            <button
              className="w-full rounded-[0.6rem] bg-[#2b74a8] px-4 py-[0.78rem] text-sm font-semibold text-white transition hover:bg-[#215f8b] focus:outline-none focus:ring-2 focus:ring-[#2b74a8]/35"
              type="submit"
            >
              Log On
            </button>

            <a className="self-center text-[0.76rem] text-[#235b90]" href="#">
              Change Password
            </a>
          </form>
        </div>
      </section>

      <footer className="absolute bottom-[0.95rem] left-4 right-4 z-10 text-center text-[0.7rem] text-[rgba(52,76,98,0.88)] sm:left-auto sm:right-5 sm:text-left">
        Copyright (c) 2026 SAP SE All Rights Reserved.
      </footer>
    </main>
  );
}

'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../context/AppContext';
import { useState } from 'react';

export default function Login() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { setToken, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState('');

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setFormError('');
    try {
      const res = await axios.post(`${API_URL}/api/user/login`, values);
      const { token } = res.data;

      setToken(token);
      setIsAuthenticated(true);

      router.push('/todo');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || error.response?.data || 'Login failed';
        setFormError(msg);
      } else {
        setFormError('An unexpected error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>

          {formError && <div className="text-red-500 text-sm mb-3">{formError}</div>}

          <Field
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-1 border border-gray-300 rounded"
          />
          <ErrorMessage name="email" component="div" className="text-red-500 text-sm mb-3" />

          <Field
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-1 border border-gray-300 rounded"
          />
          <ErrorMessage name="password" component="div" className="text-red-500 text-sm mb-3" />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Login
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </Form>
      </Formik>
    </div>
  );
}

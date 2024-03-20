"use client"
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Formik, Form } from 'formik';
import React from 'react';
import * as Yup from "yup";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function Register() {
  const [error, setError] = useState ("");
  const [isFormSubmitting, setFormSubmitting] = useState (false);
  const router = useRouter ();


  const initialValues = {
      nome: "",
      email: "",
      senha: "",
  };
  
  const validationSchema = Yup.object().shape({
    nome: Yup.string()
      .required("O campo nome é obrigatório"),
    email: Yup.string()
      .email("Digite um e-mail válido")
      .required("O campo e-mail é obrigatório"),
    senha: Yup.string().required("O campo senha é obrigatório"),
  });

  async function handleSubmit(values, {resetForm}) {
    setFormSubmitting(true);
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
      }).then (async (res) => {
        const result = await res.json ();

        if (result.status === 201) {
          alert(result.message)
          router.push("/login")
        } else {
          renderError (result.message);
          resetForm();
        }
        setFormSubmitting (false);
      });
  } catch (erro) {
    setFormSubmitting (false);
    renderError("Erro ao criar conta, tente mais tarde!");
  }
}

function renderError (msg) {
  setError (msg);
  setTimeout(() => {
    setError("");
  }, 3000);
}

  return (
    <main className = "min-h-screen flex items-center justify-center">
        <Formik 
          initialValues={initialValues} 
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          >
            {({values}) => (
            <Form 
              noValidate 
              className="flex flex-col gap-2 p-4 border rounded
              border-zinc-300 min-w-[300px] bg-white"
              >
                <Input 
                  name="nome"  
                  required/>
                <Input 
                  name="email" 
                  type="email" 
                  required/>
                <Input 
                  name="senha" 
                  type="password" 
                  required 
                  autoComplete="off"/>
                <Button
                  type ="submit"
                  text={isFormSubmitting ? "Carregando...": "Inscrever-se"}
                  disabled={isFormSubmitting}
                  className="bg-green-500 text-white rounded p-2 cursor-pointer "
                />
                {!values.nome && !values.email && !values.senha && error && (
                  <span className="text-red-500 text-sm text-center">(error)</span>
                )}
                <span className="text-xs text-zinc-500">
                  Não possuí uma conta?
                  <strong className="text-zinc-700">
                    <Link href="/login">Entre</Link>
                  </strong>
                </span>
            </Form>
            )}
        </Formik>
    </main>
  );
}

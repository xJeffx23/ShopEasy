"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { 
  CircleHelp, 
  Phone, 
  Mail, 
  MessageCircle, 
  BookOpen, 
  Video,
  Download,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/sistema/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <CircleHelp className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Centro de Ayuda</h1>
              <p className="text-slate-600 mt-1">
                Encuentra respuestas, tutoriales y soporte técnico
              </p>
            </div>
          </div>
        </div>

        {/* Tarjetas de ayuda principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Guía de Usuario</CardTitle>
              </div>
              <CardDescription>
                Aprende a usar todas las funcionalidades del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2">
                <Download className="h-4 w-4" />
                Descargar PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Video className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Video Tutoriales</CardTitle>
              </div>
              <CardDescription>
                Videos paso a paso para aprender rápidamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                Ver Tutoriales
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg">FAQ</CardTitle>
              </div>
              <CardDescription>
                Preguntas frecuentes y respuestas rápidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                Ver FAQ
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sección de contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <CircleHelp className="h-6 w-6" />
              ¿Necesitas ayuda adicional?
            </CardTitle>
            <CardDescription>
              Nuestro equipo de soporte está disponible para ayudarte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mx-auto mb-3">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Llámanos</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Soporte telefónico de lunes a viernes
                </p>
                <p className="font-mono text-sm text-slate-800">+506 6347-6927</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 mx-auto mb-3">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Respuesta en 24 horas hábiles
                </p>
                <p className="font-mono text-sm text-slate-800">soporte@patitosdelretiro.com</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 mx-auto mb-3">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Chat en vivo</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Chat instantáneo con nuestro equipo
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Iniciar Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

              </div>
    </div>
  );
}

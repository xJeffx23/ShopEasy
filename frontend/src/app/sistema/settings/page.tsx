"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { 
  Moon, 
  Sun, 
  Palette, 
  Type, 
  Eye, 
  Smartphone,
  Tablet,
  Accessibility,
  ArrowLeft
} from "lucide-react";
import { useTheme } from "@/src/contexts/theme-context";
import { useAccessibility } from "@/src/contexts/accessibility-context";
import Link from "next/link";

export default function SettingsPage() {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { 
    fontSize, 
    setFontSize, 
    contrast, 
    setContrast,
    highContrastMode 
  } = useAccessibility();

  const [userAgent, setUserAgent] = useState('Detectando...');

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large' | 'extra-large') => {
    setFontSize(size);
  };

  const handleContrastChange = (newContrast: 'normal' | 'high') => {
    setContrast(newContrast);
  };

  // Detectar user agent solo en el cliente para evitar error de hidratación
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const detected = `${navigator.userAgent.split(' ')[0]} ${navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)/)?.[0] || ''}`;
      setUserAgent(detected);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/sistema/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Configuración
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Personaliza tu experiencia y ajusta las opciones de accesibilidad
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Tema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apariencia
              </CardTitle>
              <CardDescription>
                Elige el tema visual que prefieras para la interfaz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selector de tema */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Tema</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Sun className="h-4 w-4" />
                    Claro
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Moon className="h-4 w-4" />
                    Oscuro
                  </Button>
                </div>
              </div>

              {/* Vista previa */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Vista previa</Label>
                <div className={`p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-slate-800 border-slate-700' 
                    : 'bg-white border-slate-200'
                }`}>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Este es un ejemplo de cómo se verá la interfaz con el tema seleccionado.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accesibilidad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accesibilidad
              </CardTitle>
              <CardDescription>
                Ajusta las opciones para mejorar la accesibilidad y comodidad visual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tamaño de fuente */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Tamaño de fuente
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <Button
                      key={size}
                      variant={fontSize === size ? 'default' : 'outline'}
                      onClick={() => handleFontSizeChange(size)}
                      className="text-sm"
                    >
                      {size === 'small' && 'Pequeño'}
                      {size === 'medium' && 'Mediano'}
                      {size === 'large' && 'Grande'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Contraste */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Contraste
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={contrast === 'normal' ? 'default' : 'outline'}
                    onClick={() => handleContrastChange('normal')}
                  >
                    Normal
                  </Button>
                  <Button
                    variant={contrast === 'high' ? 'default' : 'outline'}
                    onClick={() => handleContrastChange('high')}
                  >
                    Alto
                  </Button>
                </div>
              </div>

                          </CardContent>
          </Card>

          
          {/* Información del dispositivo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Información del sistema
              </CardTitle>
              <CardDescription>
                Detalles sobre tu navegador y configuración actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                    Navegador:
                  </span>
                  <span className="font-medium">
                    {userAgent}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                    Tema actual:
                  </span>
                  <span className="font-medium">
                    {theme === 'dark' ? 'Oscuro' : 'Claro'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                    Tamaño de fuente:
                  </span>
                  <span className="font-medium">
                    {fontSize === 'small' && 'Pequeño'}
                    {fontSize === 'medium' && 'Mediano'}
                    {fontSize === 'large' && 'Grande'}
                    {fontSize === 'extra-large' && 'Extra Grande'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                    Contraste:
                  </span>
                  <span className="font-medium">
                    {contrast === 'high' ? 'Alto' : 'Normal'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Restablecer valores
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

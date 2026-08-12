import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Résultat retourné par le service d'analyse IA (photo -> type de déchet + urgence).
 * Structure alignée sur ce que l'équipe backend/IA devrait renvoyer.
 * Pour l'instant les valeurs sont simulées (mock) le temps que l'API soit branchée.
 */
interface AiAnalysisResult {
  label: string; // ex: "Dépôt sauvage - Urgent"
  matchPercent: number; // ex: 98
  urgency: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-signaler-probleme',
  imports: [FormsModule, CommonModule],
  templateUrl: './signaler-probleme.html',
  styleUrl: './signaler-probleme.css',
})
export class SignalerProbleme {
   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // --- État de l'image ---
  imagePreviewUrl: string | null = null;
  selectedFile: File | null = null;

  // --- État de l'analyse IA ---
  isAnalyzing = false;
  analysisResult: AiAnalysisResult | null = null;

  // --- Champs du formulaire ---
  description = '';
  isRecording = false;
  locationLabel = 'Ma position';

  // --- État d'envoi ---
  isSubmitting = false;

  router = inject(Router);

  goBack(): void {
    // TODO(intégration navigation): adapter si une route "accueil" précise est requise
    this.router.navigate(['/'])
  }

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
      this.runAiAnalysis();
    };
    reader.readAsDataURL(file);
  }

  /**
   * Reprendre une photo : réouvre le sélecteur de fichier.
   * Correspond au bouton "recharger" affiché en haut à droite de l'image.
   */
  retakePhoto(): void {
    this.analysisResult = null;
    this.openFilePicker();
  }

  /**
   * Simulation de l'appel à l'API d'analyse IA.
   * À REMPLACER par l'appel réel (ex: this.reportService.analyzeImage(this.selectedFile))
   * quand l'API sera disponible. La forme du résultat (AiAnalysisResult) est déjà prête.
   */
  private runAiAnalysis(): void {
    this.isAnalyzing = true;
    this.analysisResult = null;

    setTimeout(() => {
      this.analysisResult = {
        label: 'Dépôt sauvage - Urgent',
        matchPercent: 98,
        urgency: 'high',
      };
      this.isAnalyzing = false;
    }, 1500);
  }

  toggleVoiceInput(): void {
    // TODO(intégration reconnaissance vocale): brancher l'API Web Speech ou équivalent
    this.isRecording = !this.isRecording;
  }

  refreshLocation(): void {
    // TODO(intégration géolocalisation): brancher la géolocalisation réelle
    this.locationLabel = 'Ma position';
  }

  openMap(): void {
    // TODO(intégration carte): ouvrir une modale/carte pour ajuster la position
  }

  get canSubmit(): boolean {
    return !!this.imagePreviewUrl && !this.isAnalyzing && !this.isSubmitting;
  }

  onSubmit(): void {
    if (!this.canSubmit) {
      return;
    }

    this.isSubmitting = true;

    // TODO(intégration API): remplacer par l'appel réel au service de signalement
    // this.reportService.submit({ file: this.selectedFile, description: this.description,
    //   analysis: this.analysisResult, location: this.locationLabel }).subscribe(...)
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/signalement-success']);
    }, 800);
  }
}

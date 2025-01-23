/**
 * INF3190 – Introduction à la programmation web
 * TP2 – Automne 2024
 * @author MARIUS GUIMATSIA AKALONG (GUIM27309006)
 * @description
    * Script de Validation et Soumission du Formulaire d'Assurance
    *
    * Gère la validation des champs du formulaire, les mises à jour dynamiques de l'interface utilisateur,
    * et la logique de soumission pour calculer et afficher les primes d'assurance basées sur les entrées utilisateur.
    *
    * Fonctionnalités :
    * - Validation des champs du formulaire (genre, date de naissance, détails du véhicule, etc.).
    * - Mise à jour dynamique de l'interface utilisateur en fonction des choix de l'utilisateur.
    * - Calcul des primes annuelles et mensuelles selon des règles prédéfinies.
    * - Retour en temps réel sur la validation des champs.
 */

document.addEventListener('DOMContentLoaded', function () {

    // Fonctions Utilitaires

    /**
     * Calcule l'âge à partir d'une date donnée.
     * @param {string} valDate - La date au format valide.
     * @returns {number} - L'âge calculé en années.
     */
    function getAge(valDate) {
        const date = new Date(valDate);
        const today = new Date();
        return today.getFullYear() - date.getFullYear();
    }

    /**
     * Affiche un message de succès ou d'erreur.
     * @param {string} message - Le message à afficher.
     * @param {number} returnCode - 0 pour succès, 1 pour erreur.
     */
    function afficherMessage(message, returnCode) {
        result.innerHTML = message;
        result.classList.remove('hidden');
        result.className = returnCode === 0 ? 'success' : 'error-message';
        newSubmission.classList.remove('hidden');
        form.classList.add('hidden');
    }

    /**
     * Valide un champ du formulaire en fonction de son ID et de sa valeur.
     * @param {HTMLElement} field - Le champ à valider.
     * @returns {boolean} - True si le champ est valide, false sinon.
     */
    function validerChamp(field) {
        const error = document.getElementById(`${field.id}_error`);
        let estValide = true;
        let msgErreur = '';
        let genre = '';

        switch (field.id) {
            case 'gender':
                if (!field.value) {
                    estValide = false;
                    msgErreur = 'Veuillez choisir votre genre !';
                }
                break;

            case 'dob':
                const date = new Date(field.value);
                const year = getAge(field.value);
                if (isNaN(date.getTime())) {
                    estValide = false;
                    msgErreur = 'Date invalide.';
                } else if (year >= 100) {
                    estValide = false;
                    msgErreur = 'Désolé ! Age non assurable (100 ans et plus).';
                } else if (!field.value) {
                    estValide = false;
                    msgErreur = 'Votre date de naissance est requise.';
                } else {
                     genre = document.getElementById('gender').value;
                    if (genre === '') {
                        estValide = false;
                        msgErreur = 'Genre non défini.';
                    } else if ((genre === 'femme' && year < 16) ||
                               (genre !== 'femme' && year < 18)) {
                        estValide = false;
                        msgErreur = 'Désolé ! Le profil fourni n\'est pas assurable.';
                    }
                }
                break;

            case 'vehicule_value':
                if (field.value > 100000) {
                    estValide = false;
                    msgErreur = 'Désolé ! Véhicule non assurable (valeur supérieure à 100 000$).';
                } else if (field.value <= 0) {
                    estValide = false;
                    msgErreur = 'La valeur du véhicule doit être supérieure à 0 !';
                }
                break;

            case 'vehicule_year':
                const currentYear = new Date().getFullYear();
                if ((currentYear - field.value) > 25) {
                    estValide = false;
                    msgErreur = 'Désolé ! Véhicule non assurable (25 ans et plus).';
                } else if (field.value < 1900) {
                    estValide = false;
                    msgErreur = 'Erreur : Année invalide.';
                }
                break;

            case 'mileage':
                if (field.value > 50000) {
                    estValide = false;
                    msgErreur = 'Désolé ! Kilométrage trop élevé.';
                } else if (field.value < 0) {
                    estValide = false;
                    msgErreur = 'Erreur ! Le kilométrage doit être positif.';
                }
                break;

            case 'nb_reclamations':
                if (field.value < 0 || field.value > 4) {
                    estValide = false;
                    msgErreur = 'Désolé ! Le nombre de réclamations ne peut pas dépasser 4.';
                }
                break;

            case 'has_camera_no':
                if (field.checked) {
                    estValide = false;
                    msgErreur = 'Désolé ! Ce véhicule est non assurable pour défaut de caméra.';
                }
                break;
        }

        error.style.display = estValide ? 'none' : 'block';
        error.textContent = msgErreur;
        return estValide;
    }

    // Éléments DOM
    const form = document.getElementById('reclamation-form');
    const result = document.getElementById('result');
    const newSubmission = document.getElementById('new_submission');

    // Écouteurs d'Événements

    // Validation en temps réel des champs du formulaire
    form.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('change', function () {
            validerChamp(this);
        });
    });

    // Gestion du champ de nombre de réclamations
    document.querySelectorAll("input[name=is_not_first_reclamation]").forEach(element => {
        element.addEventListener('change', function () {
            const nbReclamationGroup = document.getElementById('nb_reclamations_group');
            if (this.value === 'yes') {
                nbReclamationGroup.classList.remove('hidden');
            } else {
                nbReclamationGroup.classList.add('hidden');
                document.getElementById('reclamation_amount').innerHTML = '';
            }
        });
    });

    // Mise à jour des champs de réclamations dynamiques
    document.getElementById('nb_reclamations').addEventListener('change', function () {
        const reclamationAmount = document.getElementById('reclamation_amount');
        reclamationAmount.innerHTML = '';

        if (this.value > 0 && this.value <= 4) {
            reclamationAmount.classList.remove('hidden');
            for (let i = 1; i <= this.value; i++) {
                reclamationAmount.insertAdjacentHTML('beforeend', `
                    <div class="form-group">
                        <label for="reclamation_amount${i}">Pour la réclamation #${i}, quel montant avez-vous réclamé?</label>
                        <input type="number" id="reclamation_amount${i}" min="0"  required>
                        <div id="reclamation_amount${i}_error" class="error"></div>
                    </div>
                `);
            }
        } else {
            reclamationAmount.classList.add('hidden');
        }
    });

    // Soumission du formulaire
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let estValide = true;

        form.querySelectorAll('input:not(.hidden), select:not(.hidden)').forEach(field => {
            if (!validerChamp(field)) estValide = false;
        });

        if (!estValide) {
            //alert("Erreur ! Nous ne pouvons pas traiter votre requete car elle n'est pas valide.");

            afficherMessage(`
                <h2>Désolé ! Nous ne pouvons pas traiter votre requête.</h2>
                <hr>
                <p>Un ou plusieurs champs ne correspondent pas aux profils assurable</p>
            `, 1);
            return;
        }

        const genre = document.getElementById('gender').value;
        const age = getAge(document.getElementById('dob').value);
        const valeurVehicule = parseFloat(document.getElementById('vehicule_value').value);
        const kilometrage = parseFloat(document.getElementById('mileage').value);

        let montantDeBase = 0;
        if ((genre === 'homme' || genre === 'non-binaire') && age < 25) {
            montantDeBase = 0.05 * valeurVehicule;
        } else if (age >= 75) {
            montantDeBase = 0.04 * valeurVehicule;
        } else {
            montantDeBase = 0.015 * valeurVehicule;
        }

        let montantTotalReclamations = 0;
        let nbReclamations = 0;
        if (document.getElementById('is_not_first_reclamation').checked) {
            nbReclamations = parseInt(document.getElementById('nb_reclamations').value, 10);
            for (let i = 1; i <= nbReclamations; i++) {
                montantTotalReclamations += parseFloat(document.getElementById(`reclamation_amount${i}`).value || 0);
            }
        }

        if (montantTotalReclamations > 35000) {
            afficherMessage(`
                <h2>Désolé ! Nous ne pouvons pas traiter votre requête.</h2>
                <hr>
                <p>Montant limite dépassé : 35 000$.</p>
            `, 1);
            return;
        }

        let montantAnnuel = montantDeBase + 350 * nbReclamations + 0.02 * kilometrage;
        if (montantTotalReclamations > 25000) montantAnnuel += 700;

        const montantMensuel = (montantAnnuel / 12).toFixed(2);
        afficherMessage(`
            <h2>Félicitations ! Votre soumission a été acceptée.</h2>
            <hr>
            <ul>
                <li>Prix annuel de la soumission : ${montantAnnuel.toFixed(2)}$</li>
                <li>Prime mensuelle : ${montantMensuel}$</li>
            </ul>
        `, 0);
    });

    // Réinitialisation du formulaire
    newSubmission.addEventListener('click', function () {
        form.reset();
        form.classList.remove('hidden');
        result.classList.add('hidden');
        newSubmission.classList.add('hidden');
        document.getElementById('nb_reclamations_group').classList.add('hidden');
        document.getElementById('reclamation_amount').innerHTML = '';
    });
});

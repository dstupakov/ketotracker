import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Health } from '@ionic-native/health';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  nutritionFat;
  bloodGlucose;

  constructor(public navCtrl: NavController, private health: Health) {
    this.health.isAvailable()
    .then((available:boolean) => {
      this.health.requestAuthorization([{
          read: ['steps', 'height', 'weight', 'nutrition'],       //read only permission
        }])
      })
      .then(_ => {
        this.getNutritionFat()
        this.getBloodGlucose()
      })
      .catch(e => console.log(e));
    }
    getNutritionFat () {
      this.health.query({
        startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // three days ago
        endDate: new Date(), // now
        dataType: 'nutrition.total.fat', 
      }).then(data => {
        this.nutritionFat = data
        console.log(this.nutritionFat)
      })
    } 
    getBloodGlucose () {
      this.health.query({
        startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // three days ago
        endDate: new Date(), // now
        dataType: 'blood_glucose', 
      }).then(data => {
        this.bloodGlucose = data
        console.log(this.bloodGlucose)
      })
    } 
  }
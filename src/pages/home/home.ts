import { Health } from '@ionic-native/health';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  totalFat;
  totalProtein;
  totalCarbs;
  weight;
 
  constructor(private platform: Platform, public navCtrl: NavController, private health: Health) {
    this.platform.ready().then(() => {
      this.health.isAvailable()
      .then((available:boolean) => {
        this.health.requestAuthorization([{
            read: ['steps', 'height', 'weight', 'nutrition'],       //read only permission
          }])
        })
        .then(_ => {
          this.getFat()
          this.getProtein()
          this.getCarbs()
          this.getWeight()
        })
        .catch(e => console.log(e));
      })
      .catch(e => console.log(e)); 
  }
  getWeight() {
    this.health.query({
      startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // three days ago
      endDate: new Date(), // now
      dataType: 'weight', 
    }).then(weight => {
      this.weight = weight
      console.log(this.weight)
    })
  }
  
  getFat() {
    this.health.queryAggregated({
      startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // three days ago
      endDate: new Date(), // now
      dataType: 'nutrition.fat.total', 
      bucket: 'day'
    }).then(fatData => {
      this.totalFat = fatData
      console.log(this.totalFat)
    })
  }

  getProtein() {
    this.health.queryAggregated({
      startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // three days ago
      endDate: new Date(), // now
      dataType: 'nutrition.protein', 
      bucket: 'day'
    }).then(proteinData => {
      this.totalProtein = proteinData
      console.log(this.totalProtein)
    })
  }

  getCarbs() {
    // Get Carbs
    this.health.queryAggregated({
      startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // three days ago
      endDate: new Date(), // now
      dataType: 'nutrition.carbs.total', 
      bucket: 'day'
    }).then(carbData => {
      this.totalCarbs = carbData
      console.log(this.totalCarbs)
    })
  }
}

import { Health } from '@ionic-native/health';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  totalFat= [];
  totalProtein = [];
  totalCarbs = [];
  weight;
  combinedData = [];

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
        .then(_ => {
          this.combinedData = this.combineData(this.totalFat, this.totalProtein, this.totalCarbs)
          console.log("Combined Data:" + this.combinedData)
        })
        .catch(e => console.log(e));
      })
      .catch(e => console.log(e)); 
  }
  getWeight() {
    this.health.query({
      startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // three days ago
      endDate: new Date(), // now
      dataType: 'weight'
    }).then(weight => {
      this.weight = weight
      console.log("Weight:" + this.weight)
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
      console.log("Fat:" + this.totalFat)
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
      console.log("Protein:" + this.totalProtein)
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
      console.log("Carbs:" + this.totalCarbs)
    })
  }

  combineData = (totalFat, totalProtein, totalCarbs) => {
    // define getStartDates to be a helper function that you can call on a list (such as totalFat) and it returns a list of the start dates that correspond to the elements in the list.
    const getStartDates = (list) => list.map(v => v.startDate)

    // get a list of start dates from one list (totalFat). 
    // NOTE: Assuming all lists have the same start dates.
    const totalFatStartDates = getStartDates(totalFat);

    // map from these start dates to a set of new complete objects that include all data for each start date (compiled from all 3 lists) and return the resulting array of objects.
    return totalFatStartDates.map(startDate => {
      var totalCarbsValue = totalCarbs.filter(tc => tc.startDate == startDate)[0]
      var totalProteinValue = totalProtein.filter(tp => tp.startDate == startDate)[0]
      var totalFatValue = totalFat.filter(tf => tf.startDate == startDate)[0]

      return {
        "startDate":startDate,
        "endDate":totalCarbsValue.endDate,
        "data": {
          "totalCarbs": {
            "value":totalCarbsValue.value,"unit":totalCarbsValue.unit
          },
          "totalProtein": {
            "value":totalProteinValue.value,"unit":totalProteinValue.unit
          },
          "totalFat": {
            "value":totalFatValue.value,"unit":totalFatValue.unit
          }
        }
      }
    })
  }
}

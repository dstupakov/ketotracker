import { Health } from '@ionic-native/health';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  totalFat = [{"startDate":"2018-02-11T06:00:00.000Z","endDate":"2018-02-12T06:00:00.000Z","value":0,"unit":"g"},{"startDate":"2018-02-12T06:00:00.000Z","endDate":"2018-02-13T06:00:00.000Z","value":0,"unit":"g"},{"startDate":"2018-02-13T06:00:00.000Z","endDate":"2018-02-14T06:00:00.000Z","value":0,"unit":"g"},{"startDate":"2018-02-14T06:00:00.000Z","endDate":"2018-02-15T06:00:00.000Z","value":0,"unit":"g"},{"startDate":"2018-02-15T06:00:00.000Z","endDate":"2018-02-16T06:00:00.000Z","value":124.29999999999998,"unit":"g"},{"startDate":"2018-02-16T06:00:00.000Z","endDate":"2018-02-17T06:00:00.000Z","value":108.27,"unit":"g"},{"startDate":"2018-02-17T06:00:00.000Z","endDate":"2018-02-18T06:00:00.000Z","value":148.595,"unit":"g"},{"startDate":"2018-02-18T06:00:00.000Z","endDate":"2018-02-19T06:00:00.000Z","value":100.1,"unit":"g"}];
  totalProtein = [{"startDate":"2018-02-11T06:00:00.000Z","endDate":"2018-02-12T06:00:00.000Z","value":0,"unit":"g"},{"startDate":"2018-02-12T06:00:00.000Z","endDate":"2018-02-13T06:00:00.000Z","value":0,"unit":"g"},{"startDate":"2018-02-13T06:00:00.000Z","endDate":"2018-02-14T06:00:00.000Z","value":0,"unit":"g"},{"startDate":"2018-02-14T06:00:00.000Z","endDate":"2018-02-15T06:00:00.000Z","value":0,"unit":"g"},{"startDate":"2018-02-15T06:00:00.000Z","endDate":"2018-02-16T06:00:00.000Z","value":80.25,"unit":"g"},{"startDate":"2018-02-16T06:00:00.000Z","endDate":"2018-02-17T06:00:00.000Z","value":111.77000000000001,"unit":"g"},{"startDate":"2018-02-17T06:00:00.000Z","endDate":"2018-02-18T06:00:00.000Z","value":123.20166666666668,"unit":"g"},{"startDate":"2018-02-18T06:00:00.000Z","endDate":"2018-02-19T06:00:00.000Z","value":121.27666666666667,"unit":"g"}];
  totalCarbs = [{"startDate":"2018-02-11T06:00:00.000Z","endDate":"2018-02-12T06:00:00.000Z","value":0,"unit":"g"},{"startDate":"2018-02-12T06:00:00.000Z","endDate":"2018-02-13T06:00:00.000Z","value":0,"unit":"g"},{"startDate":"2018-02-13T06:00:00.000Z","endDate":"2018-02-14T06:00:00.000Z","value":0,"unit":"g"},{"startDate":"2018-02-14T06:00:00.000Z","endDate":"2018-02-15T06:00:00.000Z","value":0,"unit":"g"},{"startDate":"2018-02-15T06:00:00.000Z","endDate":"2018-02-16T06:00:00.000Z","value":46,"unit":"g"},{"startDate":"2018-02-16T06:00:00.000Z","endDate":"2018-02-17T06:00:00.000Z","value":40.09999990463257,"unit":"g"},{"startDate":"2018-02-17T06:00:00.000Z","endDate":"2018-02-18T06:00:00.000Z","value":64.76000022888184,"unit":"g"},{"startDate":"2018-02-18T06:00:00.000Z","endDate":"2018-02-19T06:00:00.000Z","value":50,"unit":"g"}];
  weight;

  summary = Object.assign({}, this.totalFat, this.totalProtein, this.totalCarbs);

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
      // this.totalFat = fatData
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
      // this.totalProtein = proteinData
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
      // this.totalCarbs = carbData
      console.log(this.totalCarbs)
    })
  }
}

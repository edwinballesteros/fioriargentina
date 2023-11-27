sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "project3/util/formatter",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast, MessageBox, formatter, Filter, FilterOperator) {
        "use strict";
        var that;
        return Controller.extend("project3.controller.View1", {
            onInit: function () {
                that = this;
            },
            onBeforeRendering : function (){
                var oModel = this.getView().getModel();
                return new Promise(function (resolve, reject) {
                    oModel.read("/Orders" , {
                        async: false,
                        success: function (result) {
                            let datos = result.results;
                            that.getView().setModel(new JSONModel(datos), "ordenes")
                            resolve(result);
                        },
                        error: function (error) {
                            reject(error);
                        }
                    });
                });
            },
            onItemPress : function (oEvent){
                var oItem = oEvent.getParameter("listItem").getBindingContext("ordenes").getObject();
                console.log(oItem.OrderID);
                var oModel = this.getView().getModel();
                sap.ui.core.BusyIndicator.show(0);
                return new Promise(function (resolve, reject) {
                    oModel.read("/Orders("+ oItem.OrderID + ")/Order_Details" , {
                        urlParameters: {
                            "$expand": "Product"
                        },
                        async: false,
                        success: function (result) {
                            sap.ui.core.BusyIndicator.hide();
                            let datos = result.results;
                            that.getView().setModel(new JSONModel(datos), "modelDetails")
                            resolve(result);
                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            reject(error);
                        }
                    });
                });
            },
            onDelete : function(){
               let oTable = this.byId("tbOrderDetails");
               let itemSel = oTable.getSelectedIndex();

               if (itemSel != -1){
               let idProducto = oTable.getRows()[itemSel].getCells()[2].getText()
               let idOrden = oTable.getRows()[itemSel].getCells()[1].getText();
               var oModel = this.getView().getModel();
               MessageBox.confirm(formatter.onGetI18nText(this, "confirmacionBorrado"),
               {
				actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
				onClose: function (sAction) {
                    if (sAction == MessageBox.Action.OK){
                        return new Promise(function (resolve, reject) {
                            oModel.remove("/Order_Details(OrderID="+ idOrden + ",ProductID="+ idProducto + ")" , {
                                async: false,
                                success: function (result) {
                                    let datos = result;
                                    MessageToast.show("Exitoso")
                                    resolve(result);
                                },
                                error: function (error) {
                                    MessageToast.show(error.message)
                                    reject(error);
                                }
                            });
                        });
                    }
				}
			    })
               
            }
            else {
                MessageBox.error(formatter.onGetI18nText(this, "errorDelete"))
            }
            },
            onSearch: function (oEvent){
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("OrderID", FilterOperator.EQ, sQuery);
                    aFilters.push(filter);
                }
    
                // update list binding
                var oList = this.byId("idList");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            },
            onOpenDialog: function () {
                let oTable = this.byId("tbOrderDetails");
               let itemSel = oTable.getSelectedIndex();

               if (itemSel != -1){
               let idProducto = oTable.getRows()[itemSel].getCells()[2].getText()
               let idOrden = oTable.getRows()[itemSel].getCells()[1].getText();
               var oModel = this.getView().getModel();
               return new Promise(function (resolve, reject) {
                    oModel.read("/Order_Details(OrderID="+ idOrden + ",ProductID="+ idProducto + ")" , {
                        async: false,
                        success: function (result) {
                            let datos = result;
                            let oDetail = {};
                            oDetail.ProductID = result.ProductID;
                            oDetail.OrderID = result.OrderID;
                            oDetail.Quantity = result.Quantity;
                            oDetail.UnitPrice = result.UnitPrice;
                            that.getView().setModel(new JSONModel(oDetail), "detail")
                            if (!that.oMPDialog) {
                                that.oMPDialog = that.loadFragment({
                                    name: "project3.view.fragments.update"
                                });
                            }
                            that.oMPDialog.then(function (oDialog) {
                                that.oDialog = oDialog;
                                that.oDialog.open();
                                //this._oMessageManager.registerObject(this.oView.byId("btEdit"), true);
            
                            }.bind(that));
                            resolve(result);
                        },
                        error: function (error) {
                            reject(error);
                        }
                    });
                });
               }
                
         
            }
        });
    });

sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function (JSONModel, Device, MessageBox, MessageItem, MessageView, Spreadsheet) {
	"use strict";

	return {
		onGetFormatDate: function (date) {
			if (date && date !== "") {
				var y = date.getUTCFullYear(),
					m = date.getUTCMonth() + 1,
					d = date.getUTCDate();

				m = m < 10 ? "0" + m : m;
				d = d < 10 ? "0" + d : d;

				return d.toString() + "/" + m.toString() + "/" + y.toString();
			} else {
				return "";
			}
		},

		onGetStatus: function (status) {
			if (status === "I") {
				return "Iniciado";
			} else if (status === "A") {
				return "Aprobado";
			} else if (status === "C") {
				return "Cancelado";
			} else if (status === "P") {
				return "Pendiente";
			} else if (status === "R") {
				return "Rechazado";
			} else {
				return "";
			}
		},

		onGetState: function (status) {
			if (status === "I") {
				return "Success";
			} else if (status === "A") {
				return "Success";
			} else if (status === "C") {
				return "Error";
			} else if (status === "P") {
				return "Success";
			} else if (status === "R") {
				return "Error";
			} else {
				return "None";
			}
		},

		onGetPersonType: function (personType) {
			if (personType === 1) {
				return 1;
			} else if (personType === 2) {
				return 0;
			} else {
				return 0;
			}
		},

		onGetI18nText: function (oThat, sText) {
			return oThat.oView.getModel("i18n") === undefined ? oThat.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sText) :
				oThat.oView.getModel("i18n").getResourceBundle().getText(sText);
		}
	};
});
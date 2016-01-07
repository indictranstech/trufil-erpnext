// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

cur_frm.add_fetch('customer','customer_name','customer_name');
cur_frm.add_fetch('customer','customer_code','customer_code');

//fetch contract details
cur_frm.add_fetch('contract','administrative_contact','administrative_contact');
cur_frm.add_fetch('contract','administrative_contact_details','administrative_contact_details');
cur_frm.add_fetch('contract','billing_contact','billing_contact');
cur_frm.add_fetch('contract','billing_contact_details','billing_contact_details');
cur_frm.add_fetch('contract','admin_address','admin_address');
cur_frm.add_fetch('contract','admin_address_details','admin_address_details');

cur_frm.add_fetch('contract','contract_value','contract_value');
cur_frm.add_fetch('contract','contract_value_as_on_today','contract_value_as_on_today');
cur_frm.add_fetch('contract','contract_quantity','contract_quantity');
cur_frm.add_fetch('contract','contact_quantity_as_on_today','contact_quantity_as_on_today');
cur_frm.add_fetch('contract','contract_start_date','contract_start_date');
cur_frm.add_fetch('contract','contract_expiry_date','contract_expiry_date');
cur_frm.add_fetch('contract','customer','customer');
cur_frm.add_fetch('contract','customer_code','customer_code');
cur_frm.add_fetch('contract','customer_name','customer_name');

// Method to get address details
cur_frm.cscript.admin_address = function(doc,cdt,cdn){

	erpnext.utils.get_address_display(this.frm, "admin_address","admin_address_details");
}


//frappe call for retriveing administrative contact details and setting all details to a field
cur_frm.cscript.administrative_contact = function(doc,cdt,cdn){
	frappe.call({
			method:"erpnext.crm.doctype.order_register.order_register.get_contact_details",
			args:{"contact": doc.administrative_contact},
			callback: function(r) {
				if (r.message){
					doc.administrative_contact_details = (r.message['contact_display'] + '<br>' + r.message['contact_person'] + '<br>' + r.message['contact_email'] + '<br>' + r.message['contact_mobile'] + '<br>' + r.message['contact_personal_email'])
					refresh_field('administrative_contact_details')
				}
				
			}
		});

}


//frappe call for retriveing billing contact details and setting all details to a field
cur_frm.cscript.billing_contact = function(doc,cdt,cdn){
	frappe.call({
			method:"erpnext.crm.doctype.order_register.order_register.get_contact_details",
			args:{"contact": doc.billing_contact},
			callback: function(r) {
				if (r.message){
					doc.billing_contact_details = (r.message['contact_display'] + '<br>' + r.message['contact_person'] + '<br>' + r.message['contact_email'] + '<br>' + r.message['contact_mobile'] + '<br>' + r.message['contact_personal_email'])
					refresh_field('billing_contact_details')
				}
				
			}
		});

}


// Return query for getting administrative contact name in link field
cur_frm.fields_dict['administrative_contact'].get_query = function(doc) {
	return {
		filters: {
			
			"admin_contact": 1,
			"customer": doc.customer
		}
	}
}

// Return query for getting billing contact name in link field
cur_frm.fields_dict['billing_contact'].get_query = function(doc) {
	return {
		filters: {
			
			"billing_contact": 1,
			"customer": doc.customer

		}
	}
}


// Return query for getting admin address details
cur_frm.fields_dict['admin_address'].get_query = function(doc) {
	return {
		filters: {
			
			"address_type": 'Administrative',
			"customer": doc.customer
		}
	}
}


//Validation
cur_frm.cscript.order_expiry_date = function(doc,cdt,cdn){
	if(doc.order_expiry_date && doc.order_date){
		var expiry_date = new Date(doc.order_expiry_date);
		var order_date = new Date(doc.order_date);
		if(expiry_date<order_date)
			msgprint("Expiry Date must be greater than order date")
	}
}

//validation
cur_frm.cscript.order_closing_date = function(doc,cdt,cdn){
	if(doc.order_closing_date && doc.order_date){
		var closing_date = new Date(doc.order_closing_date);
		var order_date = new Date(doc.order_date);
		if(closing_date<order_date)
			msgprint("Order Closing Date must be greater than order date")
	}
}
frappe.ui.form.on("Order Register", "refresh", function(frm,doctype,name) {

		if (frm.doc.docstatus===0) {
			cur_frm.add_custom_button(__('From Contract'),
				function() {
					frappe.model.map_current_doc({
						method: "sample_register.sample_register.doctype.contract.contract.make_work_order",
						source_doctype: "Contract",
					})
				}, "icon-download", "btn-default");
		}
});
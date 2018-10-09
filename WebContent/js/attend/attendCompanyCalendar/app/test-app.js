/*!
 * Ext JS Library 3.3.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/*
 * Calendar sample code originally written by Brian Moeskau (brian@ext-calendar.com)
 * See additional calendar examples at http://ext-calendar.com
 */

var event;
var eventList;
var eventListStr;
App = function() {
	
    return {
        init : function() {
            
            Ext.BLANK_IMAGE_URL = 'http://extjs.cachefly.net/ext-3.1.0/resources/images/default/s.gif';

            // This is an example calendar store that enables the events to have
            // different colors based on CalendarId. This is not a fully-implmented
            // multi-calendar implementation, which is beyond the scope of this sample app
            this.calendarStore = new Ext.data.JsonStore({
                storeId: 'calendarStore',
                root: 'calendars',
                idProperty: 'id',
                data: calendarList, // defined in calendar-list.js
                proxy: new Ext.data.MemoryProxy(),
                autoLoad: true,
                fields: [
                    {name:'CalendarId', mapping: 'id', type: 'int'},
                    {name:'Title', mapping: 'title', type: 'string'}
                ],
                sortInfo: {
                    field: 'CalendarId',
                    direction: 'ASC'
                }
            });
            
            // A sample event store that loads static JSON from a local file. Obviously a real
            // implementation would likely be loading remote data via an HttpProxy, but the
            // underlying store functionality is the same.  Note that if you would like to 
            // provide custom data mappings for events, see EventRecord.js.
		    this.eventStore = new Ext.data.JsonStore({
		        id: 'eventStore',
		        //root: 'result',
		        data: eventList, // defined in event-list.js
				proxy: new Ext.data.MemoryProxy(),
				//fields:['id','cid','title','start','end','ad'/*,'configkey'*/]
		        fields: Ext.calendar.EventRecord.prototype.fields.getRange()
//		        sortInfo: {
//		            field: 'StartDate',
//		            direction: 'ASC'
//		        }
		    });
            new Ext.Viewport({
                layout: 'border',
                renderTo: 'calendar-ct',
                items: [{
                    id: 'app-header',
                    region: 'north',
                    height: 35,
                    border: false,
                    hidden:true,
                    contentEl: 'app-header-content'
                },{
                    id: 'app-center',
                    title: '...', // will be updated to view date range
                    region: 'center',
                    layout: 'border',
                    items: [{
                        id:'app-west',
                        region: 'west',
                        width: 176,
                        border: false,
                        items: [{
                            xtype: 'datepicker',
                            id: 'app-nav-picker',
                            cls: 'ext-cal-nav-picker',
                            listeners: {
                                'select': {
                                    fn: function(dp, dt){
                                        App.calendarPanel.setStartDate(dt);
                                    },
                                    scope: this
                                }
                            }
                        }]
                    },{
                        xtype: 'calendarpanel',
                        eventStore: this.eventStore,
                        calendarStore: this.calendarStore,
                        border: false,
                        id:'app-calendar',
                        region: 'center',
                        activeItem: 2, // month view
                        monthViewCfg: {
                            showHeader: true,
                            showWeekLinks: true,
                            showWeekNumbers: true
                        },
                        
                        initComponent: function() {
                            App.calendarPanel = this;
                            this.constructor.prototype.initComponent.apply(this, arguments);
                        },
                        
                        listeners: {
                            'eventclick': {
                                fn: function(vw, rec, el){
                                    this.showEditWindow(rec, el);
                                    this.clearMsg();
                                },
                                scope: this
                            },
                            'eventover': function(vw, rec, el){
                                //console.log('Entered evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                            },
                            'eventout': function(vw, rec, el){
                                //console.log('Leaving evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                            },
                            'eventadd': {
                                fn: function(cp, rec){
                                    this.showMsg('Event '+ rec.data.Title +' was added');
                                },
                                scope: this
                            },
                            'eventupdate': {
                                fn: function(cp, rec){
                                    this.showMsg('Event '+ rec.data.Title +' was updated');
                                },
                                scope: this
                            },
                            'eventdelete': {
                                fn: function(cp, rec){
                                    this.showMsg('Event '+ rec.data.Title +' was deleted');
                                },
                                scope: this
                            },
                            'eventcancel': {
                                fn: function(cp, rec){
                                    // edit canceled
                                },
                                scope: this
                            },
                            'viewchange': {
                                fn: function(p, vw, dateInfo){
                                    if(this.editWin){
                                        this.editWin.hide();
                                    };
                                    if(dateInfo !== null){
                                        // will be null when switching to the event edit form so ignore
                                        Ext.getCmp('app-nav-picker').setValue(dateInfo.activeDate);
                                        this.updateTitle(dateInfo.viewStart, dateInfo.viewEnd);
                                    }
                                },
                                scope: this
                            },
                            'dayclick': {
                                fn: function(vw, dt, ad, el){
                                	alert('do something...');
                                	
                                	/*Ext.Ajax.request({
                                		url : '../../arrange/searchDayAttendCompanyCalendar.do',
                                		params:{
                                			day:dt
                                		},
                                		 success : function(response, options){
                                			 var data = response.responseText;
                                	         data = eval("("+ data + ")");
                                	         if(data.dayCategory!=null){
                                	        	 
                                	         }else{
                                	        	 App.showEditWindow({
                                                     StartDate: dt,
                                                     IsAllDay: ad
                                                 }, el);
                                	        	 App.clearMsg();
                                	         }
                                		 }
                                	});*/
                                },
                                scope: this
                            },
                            'rangeselect': {
                                fn: function(win, dates, onComplete){
                                    this.showEditWindow(dates);
                                    this.editWin.on('hide', onComplete, this, {single:true});
                                    this.clearMsg();
                                },
                                scope: this
                            },
                            'eventmove': {
                                fn: function(vw, rec){
//                                    rec.commit();
//                                    var time = rec.data.IsAllDay ? '' : ' \\a\\t g:i a';
//                                    this.showMsg('Event '+ rec.data.Title +' was moved to '+rec.data.StartDate.format('F jS'+time));
                                },
                                scope: this
                            },
                            'eventresize': {
                                fn: function(vw, rec){
                                    rec.commit();
                                    this.showMsg('Event '+ rec.data.Title +' was updated');
                                },
                                scope: this
                            },
                            'eventdelete': {
                                fn: function(win, rec){
                                    this.eventStore.remove(rec);
                                    this.showMsg('Event '+ rec.data.Title +' was deleted');
                                },
                                scope: this
                            },
                            'initdrag': {
                                fn: function(vw){
                                    if(this.editWin && this.editWin.isVisible()){
                                        this.editWin.hide();
                                    }
                                },
                                scope: this
                            }
                        }
                    }]
                }]
            });
        },
        
        // The edit popup window is not part of the CalendarPanel itself -- it is a separate component.
        // This makes it very easy to swap it out with a different type of window or custom view, or omit
        // it altogether. Because of this, it's up to the application code to tie the pieces together.
        // Note that this function is called from various event handlers in the CalendarPanel above.
       
        showEditWindow : function(rec, animateTarget){
	        if(!this.editWin){
	            this.editWin = new Ext.calendar.EventEditWindow({
                    calendarStore: this.calendarStore,
					listeners: {
						'eventadd': {
							fn: function(win, rec,cid,title){
								/*Ext.Ajax.request({
                            		url : '../../arrange/searchDayIdAttendCompanyCalendar.do',
                            		 success : function(response, options){
                            			 var data = response.responseText;
                            	         data = eval("("+ data + ")");
                            	         win.hide();
         								//rec.data.IsNew = false;
         								rec.data.EventId=data.id+1;
         								rec.data.CalendarId=cid;
         								rec.data.IsAllDay=true;
         								rec.data.Title=title;
        								win.hide();
        								App.eventStore.add(rec);
         								App.showMsg('Event '+ rec.data.Title +' was added');
                            		 }
                            	});*/
								
							},
							scope: this
						},
						'eventupdate': {
							fn: function(win, rec){
								win.hide();
								rec.commit();
                                this.showMsg('Event '+ rec.data.Title +' was updated');
							},
							scope: this
						},
						'eventdelete': {
							fn: function(win, rec){
								this.eventStore.remove(rec);
								win.hide();
                                this.showMsg('Event '+ rec.data.Title +' was deleted');
							},
							scope: this
						},
                        'editdetails': {
                            fn: function(win, rec){
                                win.hide();
                                App.calendarPanel.showEditForm(rec);
                            }
                        }
					}
                });
	        }
	        this.editWin.show(rec, animateTarget);
		},
//        showEditWindow : function(rec, animateTarget){
//	        new CompanyEditForm({
//	    			id : rec.data.id,
//	    			applicantId:rec.data.applicantId,
//	    			applyStatusId:rec.data.applyStatus,
//	    			vacationName:rec.data.attendVacationType.name
//	    	}).show();
//	        
//	        this.editWin.show(rec, animateTarget);
//		},
        // The CalendarPanel itself supports the standard Panel title config, but that title
        // only spans the calendar views.  For a title that spans the entire width of the app
        // we added a title to the layout's outer center region that is app-specific. This code
        // updates that outer title based on the currently-selected view range anytime the view changes.
        updateTitle: function(startDt, endDt){
            var p = Ext.getCmp('app-center');
            
            if(startDt.clearTime().getTime() == endDt.clearTime().getTime()){
                p.setTitle(startDt.format('F j, Y'));
            }
            else if(startDt.getFullYear() == endDt.getFullYear()){
                if(startDt.getMonth() == endDt.getMonth()){
                    p.setTitle(startDt.format('F j') + ' - ' + endDt.format('j, Y'));
                }
                else{
                    p.setTitle(startDt.format('F j') + ' - ' + endDt.format('F j, Y'));
                }
            }
            else{
                p.setTitle(startDt.format('F j, Y') + ' - ' + endDt.format('F j, Y'));
            }
        },
        
        // This is an application-specific way to communicate CalendarPanel event messages back to the user.
        // This could be replaced with a function to do "toast" style messages, growl messages, etc. This will
        // vary based on application requirements, which is why it's not baked into the CalendarPanel.
        showMsg: function(msg){
            Ext.fly('app-msg').update(msg).removeClass('x-hidden');
        },
        
        clearMsg: function(){
            Ext.fly('app-msg').update('').addClass('x-hidden');
        }
    }
}();

var today = new Date().clearTime();

//Ext.Ajax.request({
//	url : '../../personal/listDutyRegister.do',
//	 success : function(response, options){
//		 var data = response.responseText;
//		 eventListStr=data;
//            data = eval("("+ data + ")");
//		 	eventList=data;
//           Ext.onReady(App.init, App);
//	 }
//});
eventList = [{
    "id": 1,
    "cid": 0,
    "title": "A long 0...",
    "start": today.add(Date.DAY, -5),
    "end": today.add(Date.DAY, -5),
    "ad": true
},{
    "id": 2,
    "cid": 2,
    "title": "A long 1...",
    "start": today.add(Date.DAY, -2),
    "end": today.add(Date.DAY, -2),
    "ad": true
},{
    "id": 3,	//记录编号
    "cid": 3,//类别编号，用于显示不同样式
    "title": "ABCD",//文字内容
    "start": today,	//计划开始日期
    "end": today,	//结束日期。
    "ad": true //ad = all day,是否全天
},{
    "id": 4,
    "cid": 4,
    "title": "A long 2...",
    "start": today.add(Date.DAY, 2),
    "end": today.add(Date.DAY, 2),
    "ad": true
}];
Ext.onReady(App.init, App);


/**
 * @author csx
 * @version 1.0
 * @date 2009-12-25
 * @class IndexPage
 * @extends Ext.Viewport
 * @description 程序的主页
 */
var IndexPage = Ext.extend(Ext.Viewport, {
	/**
	 * 头部导航
	 */
	top : new Ext.Panel({
				region : 'north',
				id : '__nortPanel',
				contentEl : 'app-header',
				height : 120
			}),
	/**
	 * 中间内容部分
	 */
	center : null,
	/**
	 * 西部菜单导航Panel
	 */
	west : new Ext.Panel({
				region : 'west',
				id : 'west-panel', //
				title : '导&nbsp;&nbsp;航',
				iconCls : 'menu-navigation',
				split : true,
				width : 220,
				autoScroll : true,
				layout : 'accordion',
				collapsible : true,
				items : []
			}),
	/**
	 * 南部导航
	 */
	south : new Ext.Panel({
				region : 'south',
				id : 'south-panel', //
				height : 28,
				border : false,
				bbar : [/*{
							text : '退出系统',
							iconCls : 'btn-logout',
							handler : function() {
								App.Logout();
							}
						}, '-', */{
							text : '在线用户',
							iconCls : 'btn-onlineUser',
							handler : function() {
								OnlineUserSelector.getView().show();
							}
						}/*, '-', {
							text : '意见箱',
							iconCls : 'btn-suggest-box',
							handler : function() {
								App.clickTopTab('SuggestBoxView', {
											title : '我的意见箱',
											userId : curUserInfo.userId
										})
							}
						}*/, '-', {
							id : 'messageTip',
							xtype : 'button',
							hidden : true,
							width : 50,
							height : 20,
							handler : function() {
								var megBtn = Ext.getCmp('messageTip');
								var megWin = Ext.getCmp('win');
								if (megWin == null) {
									new MessageWin().show();
								}
								megBtn.hide();
							}
						}, '->', {
							xtype : "tbfill"
						}, {
							xtype : 'tbtext',
							text : __companyName + '办公协同管理系统',
							id : 'toolbarCompanyName'
						}, {
							xtype : 'tbseparator'
						}, {
							pressed : false,
							text : '便签',
							iconCls : 'tipsTile',
							handler : function() {
								App.clickTopTab('PersonalTipsView');
							}
						}, {
							xtype : 'tbseparator'
						}, '-', {
							text : '收展',
							iconCls : 'btn-expand',
							handler : function() {
								var panel = Ext.getCmp("__nortPanel");
								if (panel.collapsed) {
									panel.expand(true);
								} else {
									panel.collapse(true);
								}
							}
						}/*, '-', {
							xtype : 'combo',
							mode : 'local',
							editable : false,
							value : '切换皮肤',
							width : 100,
							triggerAction : 'all',
							store : [['ext-all', '缺省浅蓝'],
									['ext-all-css04', '灰白主题'],
									['ext-all-css05', '青色主题'],
									['ext-all-css03', '粉红主题'],
									['xtheme-tp', '灰色主题'],
									['xtheme-default2', '灰蓝主题'],
									['xtheme-default16', '绿色主题'],
									['xtheme-access', 'Access风格']],
							listeners : {
								scope : this,
								'select' : function(combo, record, index) {
									if (combo.value != '') {
										var expires = new Date();
										expires
												.setDate(expires.getDate()
														+ 300);
										setCookie("theme", combo.value,
												expires, __ctxPath);
										Ext.util.CSS
												.swapStyleSheet(
														"theme",
														__ctxPath
																+ "/ext3/resources/css/"
																+ combo.value
																+ ".css");
									}
								}
							}
						}*/]
			}),

	/**
	 * 构造函数
	 */
	constructor : function() {
		this.center = new Ext.TabPanel({
					id : 'centerTabPanel',
					region : 'center',
					deferredRender : true,
					enableTabScroll : true,
					autoDestroy : true,
					activeTab : 0, // first tab initially active,
					defaults : {
						autoScroll : true,
						closable : true
						// bodyStyle : 'padding-bottom: 12px;'
					},
					items : [],
					plugins : new Ext.ux.TabCloseMenu(),
					listeners:{
						'add':function(tabPanel,comp,index){
							if(tabPanel.items.length >=6 ){
								tabPanel.remove(tabPanel.items.get(0));
								tabPanel.doLayout();
							}
							var depWin = Ext.getCmp('flowTaskInfoWin');
				            if(depWin!=null){
				            	depWin.hide();
				            }  
						},
						'tabchange' : function(){  
							var depWin = Ext.getCmp('flowTaskInfoWin');
				            if(depWin!=null){
				            	depWin.hide();
				            }  
				        }
					}
				});
//		var refreshTaskView = function() {
//			alert(12);
//			if(Ext.getCmp('TaskPanelView') != null){ //首页
//				Ext.getCmp('TaskPanelView').getUpdater().update( __ctxPath + '/flow/displayTask.do?ran=' + Math.random());
//			}
//			setTimeout(refreshTaskView, 5000*60); // 设60秒响应一次
//		};
//		refreshTaskView();
		IndexPage.superclass.constructor.call(this, {
					layout : "border", // 指定布局为border布局
					items : [this.top, this.west, this.center, this.south]
				});

		// 设置日历、声音提示、首页
		this.afterPropertySet();
		// 加载菜单
		this.loadWestMenu();
	},
	/**
	 * 设置日历、声音提示、首页
	 */
	afterPropertySet : function() {
		var centerPanel = this.center;

		// 显示信息条数按钮
		var addBtn = function(count) {
			var megBtn = Ext.getCmp('messageTip');
			var megWin = Ext.getCmp('win');
			var reMegWin = Ext.getCmp('wind');
			if (count > 0 && megWin == null && reMegWin == null) {
				megBtn
						.setText('<div style="height:25px;"><img src="'
								+ __ctxPath
								+ '/images/newpm.gif" style="height:12px;"/>你有<strong style="color: red;">'
								+ count + '</strong>信息</div>');
				soundManager.play('msgSound');
				megBtn.show();
			} else {
				megBtn.hide();
			}
		};

		var addBtnFunction = function() {
			Ext.Ajax.request({
						url : __ctxPath + '/info/countInMessage.do',
						method : 'POST',
						success : function(response, options) {
							var result = Ext.util.JSON
									.decode(response.responseText);
							count = result.count;
							addBtn(count);
							setTimeout(addBtnFunction, 5000 * 60); // 设60秒响应一次
						},
						failure : function(response, options) {
						},
						scope : this
					});
		};
		setTimeout(function() {
					// 显示当前日历
					setInterval('CalConv()', 1000);

					soundManager = new SoundManager();
					soundManager.url = __ctxPath + '/js/sound/swf/'; // path
					// to
					// SoundManager2
					// SWF
					// files
					// (note
					// trailing
					// slash)
					soundManager.beginDelayedInit();
					soundManager.debugMode = false;
					soundManager.consoleOnly = false;
					soundManager.onload = function() {
						soundManager.createSound({
									id : 'msgSound',
									url : __ctxPath + '/js/sound/mp3/msg.mp3'
								});
						//addBtnFunction();
					};
				}, 100);

		Ext.getCmp('SearchForm').render('searchFormDisplay');

	},

	/**
	 * 加载左导航树菜单
	 */
	loadWestMenu : function() {
		var westPanel = Ext.getCmp('west-panel');
		
		Ext.Ajax.request({
			url : __ctxPath + '/panelTreeMenu.do',
			success : function(response, options) {
				var arr = eval(response.responseText);
				var __activedPanelId = getCookie("__activedPanelId");
				for (var i = 0; i < arr.length; i++) {
					if('MyEMail'==arr[i].id){
						westPanel.add(new Ext.Panel({
							//id : 'MyEMail',
							title : '我的邮箱',
							iconCls : 'menu-info',
							layout : 'fit',
							animate : true,
							border : false,
							autoHeight:true,
							html:('<form id="callemailForm" style="display:none;"></form>'),
							listeners : {
								render: function(p) {
						            p.getEl().on('click', function(a,p){
						            	Ext.Ajax.request({
											url : __ctxPath + '/system/getCoreMailSessionAppUser.do',
											success : function(response , options ) {
												var result = Ext.util.JSON.decode(response.responseText);
												if(result.pp==19){
													Ext.Msg.alert('错误','请确保在“我的办公”-“我的信息”中填写了正确的交委邮箱。');
												}else{
													window.open('http://10.224.5.179/coremail/XJS/index.jsp?'+result.pp,'_blank');
												}
											}
										});
						            });
						        }
							}
						}));
					}else{
						var doc = strToDom(arr[i].subXml);
						var root = doc.documentElement || doc;
						var panel = new Ext.tree.TreePanel({
									id : arr[i].id,
									title : arr[i].text,
									iconCls : arr[i].iconCls,
									layout : 'fit',
									animate : true,
									border : false,
									//autoScroll : true,
									autoHeight:true,
									loader : new htsoft.ux.TreeXmlLoader({
										preloadChildren : true
									}),
									root : new Ext.tree.AsyncTreeNode({
										text : root.tagName,
										xmlNode : root
									}),
									listeners : {
										'click' : App.clickNode
									},
									rootVisible : false
								});
						westPanel.add(panel);
						panel.on('expand', function(p) {
							// 记住上次点激的panel
							var expires = new Date();
							expires.setDate(expires.getDate() + 30);
							setCookie("__activedPanelId", p.id, expires, __ctxPath);
						});
						// 激活上次点击的panel
						if (arr[i].id == __activedPanelId) {
							westPanel.layout.activeItem = panel;
						}
					}
				}
				westPanel.doLayout();
			}
		});
	}// end of the loadWestMenu function
});

/**
 * @author
 * @createtime
 * @class NewsForm
 * @extends Ext.Window
 * @description NewsForm表单
 * @company 宏天软件
 */
NewsImageWin=Ext.extend(Ext.Window,{
	panel:null,
	constructor:function(_cfg){
 	  Ext.applyIf(this,_cfg);
	  this.initUI();
	  NewsImageWin.superclass.constructor.call(this,{
		  id:'NewsImageWin',
		  layout:'fit',
		  title:'图片预览',
		  modal:true,
		  items:this.panel
	  });
    },
    initUI:function(){
    	this.panel=new Ext.Panel({
    		id:'ImageShowPanel',
    		width:360,height:290,
    		html:'<img src="'+__ctxPath+'/attachFiles/'+this.imagePath+'" width="360" height="290"/>'
    	});
    }
});


NewsForm = Ext.extend(Ext.Window,{
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		
		 
 
  		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		NewsForm.superclass.constructor.call(this, {
					layout : 'fit',
					items:this.formPanel,
					border : false,
					plain : true,
					id : 'NewsFormWin'+this.suffix,
					title : '详细信息',
					iconCls : 'menu-news',
					width : 800,
					minWidth : 799,
					height : 600,
					minHeight : 524,
					maximizable : true,
					modal : true,
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {

		
		this.formPanel = this.setup();
 		var newsId=this.newsId;
		if (this.newsId != null && this.newsId != 'undefined') { 
		this.formPanel.loadData({
			deferredRender : false,
			url : __ctxPath + '/info/getNews.do?newsId='+ newsId,
			root:'data',
			preName:'news',
			waitMsg : '正在载入数据...',
			success : function(form, action) {
 			//	var typeId = Ext.getCmp('typeId');
//				var typeTree = Ext.getCmp('typeTree');
// 				var treeNode = typeTree.getNodeById(typeId.value); 
//				var newsTypeSelect = Ext.getCmp('newsTypeSelect');
//				newsTypeSelect.setValue(treeNode.text);
				// 载入成功后载入图片
/*				var display = Ext.getCmp('displayAtForm'+suffix);
				var sub = Ext.getCmp('subjectIcon'+suffix);
				if (sub.value != '') {
					display.body
							.update('<img style="border:0;" width="48" height="48" src="'
									+ __ctxPath
									+ '/attachFiles/'
									+ sub.value
									+ '" border="0"/>');
				}*/
			},
			failure : function(form, action) {
				Ext.ux.Toast.msg('编辑', '载入失败');
			}
		});
	}
	var actionFlag=this.typeId;
	var suffix=this.suffix;

	//声明一个数组,用于容纳 按钮
	this.buttons=[];
	 if(this.auditingStatus==1||this.auditingStatus==2)
	{
				this.buttons = [ {
					text : '关闭',
					iconCls : '',
					handler : function() {
						Ext.getCmp('NewsFormWin'+suffix).close();
					}
				}];
	}
	else{// if(this.auditingStatus==0){
 		// 初始化功能按钮
		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					handler : function() {
						//以下为判断文本输入框是否输入为空
						var oEditor = FCKeditorAPI.GetInstance('content'+suffix) ; 
					 	// Get the Editor Area DOM (Document object).
						var oDOM = oEditor.EditorDocument ; 
						var iLength ; 
						var firstContent;
						// The are two diffent ways to get the text (without HTML markups).
						// It is browser specific. 
						if ( document.all )		// If Internet Explorer.
						{
							//iLength = oDOM.body.innerText.length ; 
							iLength = oDOM.body.innerHTML.length ;
							 firstContent=oDOM.body.innerHTML;

						}
						else					// If Gecko.
						{
							var r = oDOM.createRange() ;
							r.selectNodeContents( oDOM.body ) ;
							iLength = r.toString().length ; 
							
							firstContent= r.toString();
						}　
					　
						var fp = Ext.getCmp('NewsForm'+suffix);　
						var newTitle=Ext.getCmp('subject'+suffix);
						//var typeValue=Ext.getCmp('search_typeId').value;
　						if (fp.getForm().isValid()) {　
						if(iLength==0||firstContent=='<P></P>')
						{
							 
							Ext.MessageBox.show({
										title : '操作信息',
										msg : '内容输入框不允许为空！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-warning'
									});
							return ;
						}
					　	if(newTitle.getValue().trim()=='')
							{
								Ext.MessageBox.show({
										title : '操作信息',
										msg : '新闻标题输入框不允许为空！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-warning'
									});
								return ;
							}
							Ext.getCmp('issuer'+suffix).setValue(curUserInfo.fullname);
							var flag=true;
					/*		if(Ext.getCmp('isDeskImage'+suffix).getValue()){
								flag=false;
								var imagePath=Ext.getCmp('subjectIcon'+suffix).getValue();
								if(imagePath!=''&&imagePath!=null){
									flag=true;
								}
							}*/
							if(flag){
							fp.getForm().submit({
										method : 'post',
										waitMsg : '正在提交数据...',
										success : function(fp, action) {
											Ext.ux.Toast.msg('操作信息', '成功信息保存！');
											
											var NewsGrid=Ext.getCmp('NewsView.NewsGrid'+suffix);
 											 
/*											var P_NewsGrid=Ext.getCmp('P_NewsGrid'); 
											var PA_NewsGrid =Ext.getCmp('PA_NewsGrid');
											var S_NewsGrid =Ext.getCmp('S_NewsGrid');
											var C_NewsGrid =Ext.getCmp('C_NewsGrid');*/
											//Ext.getCmp('NewsGrid').getStore().reload();
											
/*											if(actionFlag==1)
											{
												NewsGrid.getStore().reload();
											}
											if(actionFlag==3)
											{
												P_NewsGrid.getStore().reload();	
											}
											if(actionFlag==22)
											{
												PA_NewsGrid.getStore().reload();	
										    }
										    if(actionFlag==6)
											{
												S_NewsGrid.getStore().reload();	
											}
											if(actionFlag==4)
											{
												C_NewsGrid.getStore().reload();	
											} */
											NewsGrid.getStore().reload();
											Ext.getCmp('NewsFormWin'+suffix).close();
										},
										failure : function(fp, action) {
											Ext.MessageBox.show({
														title : '操作信息',
														msg : '信息保存出错，请联系管理员！',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
											Ext.getCmp('NewsFormWin'+suffix).close();
										}
									});
						}else{
							Ext.ux.Toast.msg('提示信息', '图片新闻需要上传图片.');
						}
						}
					}
				}, {
					text : '取消',
					iconCls : 'btn-delete',
					handler : function() {
						Ext.getCmp('NewsFormWin'+suffix).close();
					}
				}]
	}	 
	
	}//end of the initUIComponents
});

NewsForm.prototype.setup = function() {
	var suffix=this.suffix;
	var _url = __ctxPath + '/info/treeNewsType.do?opt=treeSelector';
	var newsTypeSelector = new TreeSelector('newsTypeSelect', _url, '公司/部门',//新闻类型
			'typeId',false);
			
	var formPanel = new Ext.FormPanel({
		url : __ctxPath + '/info/saveNews.do?actionFlag='+this.actionFlag,
		layout : 'form',
		id : 'NewsForm'+suffix,
		frame : false,
		bodyStyle : 'padding:5px;',
		labelWidth : 55,
		formId : 'NewsFormId',
		defaultType : 'textfield',
		items : [{
					name : 'news.newsId',
					id : 'newsId'+suffix,
					xtype : 'hidden',
					value : this.newsId == null ? '' : this.newsId
				}, {
					xtype:'hidden',
					name : 'news.issuer',
					id : 'issuer'+suffix
				}, {
					name : 'news.typeId',
					id : 'typeId'+suffix,
					xtype : 'hidden' ,
					value: this.typeId == null ? '' : this.typeId  //add by smart on 20110512
				},  {
					fieldLabel : '新闻标题',
					name : 'news.subject',
					width :400,
					id : 'subject'+suffix,
					allowBlank:false
				},{
					fieldLabel:'桌面新闻',
					name:'isDeskImage',
					id:'isDeskImage'+suffix,
					xtype:'checkbox'
				}, {
						fieldLabel : '新闻状态',
						hiddenName : 'news.status',
						id : 'status'+suffix,
						xtype : 'combo',
						mode : 'local',
						editable : false,
						triggerAction : 'all',
						store : [['1', '生效'], ['0', '失效']],
						value : '1'
					} //, newsTypeSelector
					, {
						fieldLabel : '新闻作者',
						name : 'news.author',
						id : 'author'+suffix,
						allowBlank:false 
						//,
						//value : curUserInfo.fullname
					},/* {
					xtype : 'container',
					layout : "column",
					width:400,
					id:'ImageToolContainer',
					defaultType : 'textfield',
					height : 50,
					items : [ {
								xtype : 'label',
								text : '新闻图标:',
								stype : 'padding-right:10px;'
							},  {
								xtype : 'hidden',
								name : 'news.subjectIcon',// 新闻图标
								id : 'subjectIcon'+suffix
							}, {
								id : 'displayAtForm'+suffix,
								xtype : 'panel',
								width:50,
								border : false,
								html : '<img style="border:0;" width="48" height="48" src="'
										+ __ctxPath
										+ '/images/default_newsIcon.jpg" border="0"/>'
							},{
								xtype : 'button',
								iconCls : 'btn-upload',
								text : '上传',
								handler : function() {
									NewsForm.upLoadNewsIcon();
								}
							}, {
								xtype : 'button',
								iconCls : 'btn-del',
								text : '删除',
								handler : function() {
									NewsForm.deleteNewsIcon();
								}
							},{
								xtype : 'button',
								hidden:true,
								iconCls : 'btn-check',
								text : '查看图片',
								id:'CheckOutImageButton',
								handler : function() { 
								   var imagePath=Ext.getCmp('subjectIcon'+suffix).getValue();
								   if(imagePath!=''&&imagePath!=null){
								      new NewsImageWin({imagePath:imagePath}).show();
								   }else{
									   Ext.ux.Toast.msg('提示信息', '您还未增加图片.');
								   }
								}
							}]
				}, */{
					fieldLabel : '内容',
					name : 'news.content',
					id : 'content'+suffix,
					xtype : 'fckeditor',
					height : 420
				}]
	});

	return formPanel;

};
/**
 * 上传新闻图标回调函数
 * 
 * @param {}
 *            data
 */
function uploadImage(data) {
	var display = Ext.getCmp('displayAtForm'+suffix);
	var sub = Ext.getCmp('subjectIcon'+suffix);
	sub.setValue(data[0].filepath);
	display.body
			.update('<img style="border:0;" width="48" height="48" src="'
					+ __ctxPath + '/attachFiles/' + data[0].filepath
					+ '" border="0"/>');
}
/**
 * 删除新闻图标的方法
 */
NewsForm.deleteNewsIcon = function() {
			
	var suffix=this.suffix;

	var subjectIcon = Ext.getCmp('subjectIcon'+suffix);
	if (subjectIcon.value != null && subjectIcon.value != ''
			&& subjectIcon.value != 'undefined') {
		var msg = '图片一旦删除将不可恢复,';
		Ext.Msg.confirm('确认信息', msg + '是否删除?', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url : __ctxPath + '/system/deleteFileAttach.do',
					method : 'post',
					params : {
						filePath : subjectIcon.value
					},
					success : function() {
						var newsId = Ext.getCmp('newsId').value;
						if (newsId != '' && newsId != null
								&& newsId != 'undefined') {
							Ext.Ajax.request({
								url : __ctxPath + '/info/iconNews.do',
								method : 'post',
								params : {
									newsId : newsId
								},
								success : function() {
									subjectIcon.setValue('');
									// 这里改为默认图标
									Ext.getCmp('displayAtForm'+suffix).body
											.update('<img style="border:0;" width="48" height="48" src="'
													+ __ctxPath
													+ '/images/default_newsIcon.jpg" border="0"/>');
									Ext.getCmp('NewsView.NewsGrid'+suffix).getStore().reload();
								}
							});
						} else {
							subjectIcon.setValue('');
							// 这里改为默认图标
							Ext.getCmp('displayAtForm'+suffix).body
									.update('<img style="border:0;" width="48" height="48" src="'
											+ __ctxPath
											+ '/images/default_newsIcon.jpg" border="0"/>');
						}
					}
				});
			}
		});
	}// end if
	else {
		Ext.ux.Toast.msg('提示信息', '您还未增加图标.');
	}
}
/**
 * 上传新闻图标的方法
 */
NewsForm.upLoadNewsIcon = function() {
	
 	var suffix=this.suffix;

	var subjectIcon = Ext.getCmp('subjectIcon'+suffix);
	var dialog = App.createUploadDialog({
				file_cat : 'info/news',
				callback : uploadImage
			});
	if (subjectIcon.value != '' && subjectIcon.value != null
			&& subjectIcon.value != 'undefined') {
		var msg = '再次上传需要先删除原有图片,';
		Ext.Msg.confirm('信息确认', msg + '是否删除？', function(btn) {
			if (btn == 'yes') {
				// 删除图片
				Ext.Ajax.request({
					url : __ctxPath + '/system/deleteFileAttach.do',
					method : 'post',
					params : {
						filePath : subjectIcon.value
					},
					success : function() {
						var newsId = Ext.getCmp('newsId'+suffix).value;
						if (newsId != '' && newsId != null
								&& newsId != 'undefined') {
							Ext.Ajax.request({
								url : __ctxPath + '/info/iconNews.do',
								method : 'post',
								params : {
									newsId : newsId
								},
								success : function() {
									subjectIcon.setValue('');
									// 改为默认图标
									Ext.getCmp('displayAtForm'+suffix).body
											.update('<img style="border:0;" width="48" height="48" src="'
													+ __ctxPath
													+ '/images/default_newsIcon.jpg" border="0"/>');
									Ext.getCmp('NewsView.NewsGrid'+suffix).getStore().reload();
									dialog.show('queryBtn');
								}
							});
						} else {
							subjectIcon.setValue('');
							// 改为默认图标
							Ext.getCmp('displayAtForm'+suffix).body
									.update('<img style="border:0;" width="48" height="48" src="'
											+ __ctxPath
											+ '/images/default_newsIcon.jpg" border="0"/>');
							dialog.show('queryBtn');
						}
					}
				});
			}
		})
	} else {
		dialog.show('queryBtn');
	}
}
/**
 * 用于扩展一些常用的ExtJs，以简化大量重复性的代码
 */
Ext.ns('HT');
Ext.ns('HT.ux.plugins');
/**
 * 查找
 * @param {} grid
 * @param {} idName
 * @return {}
 */
function $getGdSelectedIds(grid,idName){
	var selRs = grid.getSelectionModel().getSelections();
	var ids = Array();
	for (var i = 0; i < selRs.length; i++) {
		ids.push(eval('selRs[i].data.'+idName));
	}
	return ids;
}

function $postDel(conf){
	Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url :conf.url,
					params : {ids : conf.ids},method : 'POST',
					success : function(response,options) {
						Ext.ux.Toast.msg('操作信息','成功删除该记录！');
						if(conf.callback){
							conf.callback.call(this);
							return;
						}
						if(conf.grid){
							conf.grid.getStore().reload();
						}
					},
					failure : function(response,options) {
						Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
					}
				});
			}
	});
}
/**
 * 提交表单
 * @param {} conf
 */
function $postForm(conf){
		if(conf.formPanel.getForm().isValid()){
			conf.formPanel.getForm().submit({
					scope:conf.scope?conf.scope:this,
					params:conf.params,
					url : conf.url,
					method : 'post',
					waitMsg : '正在提交数据...',
					success : function(fp, action) {
						Ext.ux.Toast.msg('操作信息', '成功信息保存！');
						if(conf.callback){
							conf.callback.call(this,fp,action);
						}
					},
					failure : function(fp, action) {
						Ext.MessageBox.show({
									title : '操作信息',
									msg : '信息保存出错，请联系管理员！',
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
						if(conf.callback){
							conf.callback.call(this);
						}
					}
				});
		}
}
/**
 * 
 * @param {} conf
 */
function $delGridRs(conf){
	var ids=$getGdSelectedIds(conf.grid,conf.idName);
	if (ids.length == 0) {
		Ext.ux.Toast.msg("操作信息", "请选择要删除的记录！");
		return;
	}
	var params={
		url:conf.url,
		ids:ids,
		grid:conf.grid
	};
	$postDel(params);
}
/**
 * 搜索，把查询的Panel提交，并且更新gridPanel的数据，
 * 使用以下所示：
 *              $search({
 *					searchPanel:this.searchPanel,
 *					gridPanel:this.gridPanel
 *				});
 * @param {} conf
 */
function $search(conf){
	var searchPanel=conf.searchPanel;
	var gridPanel=conf.gridPanel;
	if (searchPanel.getForm().isValid()) {// 如果合法
		var store = gridPanel.getStore();
		var baseParam = Ext.Ajax.serializeForm(searchPanel.getForm().getEl());
		var deParams = Ext.urlDecode(baseParam);
		deParams.start = 0;
		deParams.limit = store.baseParams.limit;
		store.baseParams = deParams;
		gridPanel.getBottomToolbar().moveFirst();
	}
}

/**
 * 搜索Panel
 * @class HT.SearchPanel
 * @extends Ext.form.FormPanel
 */
HT.SearchPanel=Ext.extend(Ext.form.FormPanel,{
	constructor:function(conf){
		//查看其是否允许多行
		var colNums=conf.colNums ? conf.colNums:1;
		Ext.apply(this,conf);
		if(colNums>1 && conf.items)
		{
			this.items=[];
			var row=null;
			var validCnt=0;
			for(var i=0;i<conf.items.length;i++)
			{
				var cmp=conf.items[i];
				if(cmp.xtype!='hidden')
				{
					if(validCnt%colNums==0)
					{
						row={xtype:'compositefield',fieldLabel:cmp.fieldLabel,items:[]};
						this.items.push(row);
					}
					else
					{
						row.items.push({xtype:'label',text:cmp.fieldLabel});
					}
					row.items.push(cmp);
					validCnt++;
				}
				else
				{
					this.items.push(cmp);
				}
			}
		}
		
		HT.SearchPanel.superclass.constructor.call(this,{
			autoHeight:true,
			border:false,
			style : 'padding:6px;background-color: white',
			buttonAlign:'center'
		});
	}
});

/**
 * 取到某项目的数据字典
 * @class DicCombo
 * @extends Ext.form.ComboBox
 */
DicCombo=Ext.extend(Ext.form.ComboBox,{
	constructor:function(config){
		Ext.apply(this,config);
		var itemName=this.itemName;
		DicCombo.superclass.constructor.call(this,{
			triggerAction : 'all',
			store : new Ext.data.ArrayStore({
							autoLoad : true,
							baseParams:{itemName:itemName},
							url : __ctxPath + '/system/loadItemDictionary.do',
							fields : ['itemId', 'itemName']
						}),
			displayField : 'itemName',
			valueField : 'itemId'
		});
	}
});

Ext.reg('diccombo',DicCombo);

/**
 * 在分页栏中的导出插件
 * @class HT.ux.plugins.Export
 * @extends Object
 */
HT.ux.plugins.Export=Ext.extend(Object, {
  constructor: function(config){
    Ext.apply(this, config);
    HT.ux.plugins.Export.superclass.constructor.call(this, config);
  },

  init : function(pagingToolbar) {
  	var excelBtn=new Ext.SplitButton({
  		text:'导出',
  		iconCls:'btn-export',
  		menu: new Ext.menu.Menu({
  			items:[
  			{
  				text:'导出当前页EXCEL',
  				iconCls:'btn-export-excel',
  				handler:function(){
  					
  				}
  			},{
  				text:'导出全部记录EXCEL',
  				iconCls:'btn-export-excel',
  				handler:function(){
  					
  				}
  			},'-',{
  				text:'导出当前页PDF',
  				iconCls:'btn-export-pdf',
  				handler:function(){
  					
  				}
  			},{
  				text:'导出全部记录PDF',
  				iconCls:'btn-export-pdf',
  				handler:function(){
  					
  				}
  			}
  			]
  		})
  	});
  	pagingToolbar.add('->');
  	pagingToolbar.add('-');
  	pagingToolbar.add(excelBtn);
  	pagingToolbar.add('-');
  	
  	pagingToolbar.on({
      beforedestroy: function(){
        excelBtn.destroy();
      }
    });
  }
});


HT.PagingBar=Ext.extend(Ext.PagingToolbar,{
	constructor:function(conf){
		var newConf={
			pageSize : conf.store.baseParams.limit?conf.store.baseParams.limit:25,
			displayInfo : true,
			displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
			emptyMsg : '当前没有记录',
			plugins:[new Ext.ux.plugins.PageComboResizer()]//new HT.ux.plugins.Export({store:conf.store})
		};
		Ext.apply(newConf,conf);
		HT.PagingBar.superclass.constructor.call(this,newConf);
	}
});

HT.JsonStore=Ext.extend(Ext.data.JsonStore,{
	constructor:function(conf){
		var def = {
					baseParams:{
						start : 0,
						limit : 25
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true
				};
		Ext.applyIf(def,conf);
		HT.JsonStore.superclass.constructor.call(this,def);
	}
});
/**
 * 
 * 
 * 表格管理控件，包括高级查询，数据导出，分页，排序等
 * @class HT.GridPanel
 * @extends Ext.grid.GridPanel
 */
HT.GridPanel=Ext.extend(Ext.grid.GridPanel,{
	constructor:function(conf){
		if(!conf.store){
			this.store=new HT.JsonStore({
				url : conf.url,
				fields:conf.fields
			});
			this.store.load();
		}else{
			this.store=conf.store;
		}
		
		this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect: conf.singleSelect?conf.singleSelect:false});

		if(conf.columns)
		{
			if(!conf.noSel)
			{
			  conf.columns.unshift(this.sm);
			}
			conf.columns.unshift(new Ext.grid.RowNumberer());
			this.columns=conf.columns;
		}else{
			this.columns=[this.sm,new Ext.grid.RowNumberer()];	
		}
		
		if(!conf.tbar){
			conf.tbar=new Ext.Toolbar();
		}
		
		this.cm=new Ext.grid.ColumnModel({
			columns:this.columns,
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});
		//加上rowActions
		if(conf.rowActions){
			var rowActionCol=conf.columns[conf.columns.length-1];
			this.plugins=rowActionCol;
		}
		
		var def={
					shim : true,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					stripeRows : true,
					autoHeight:true,
					//autoScroll:true,
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
					},
					//plugins:[Ext.ux.plugins.Print],
					bbar : new HT.PagingBar({store : this.store})
		};
		Ext.apply(def,conf);
		HT.GridPanel.superclass.constructor.call(this,def);		
	}
});

Ext.reg("htgrid",HT.GridPanel);

HT.FormPanel=Ext.extend(Ext.form.FormPanel,{
	constructor:function(conf){
		var def={
					layout : 'form',
					bodyStyle:'padding:5px',
					defaults : {
						anchor : '100%,100%'
					},
					defaultType : 'textfield',
					border:false
			};
		Ext.apply(def,conf);
		HT.FormPanel.superclass.constructor.call(this,def);
	}
});

/*
 * 为Form表单设置加载数据,使用方式如下：
 * this.formPanel.loadData({
 *				url:__ctxPath + '/system/getAppRole.do?roleId=' + this.roleId,
 *				preName:'AppRole',
 *				root:'data'
 *			});
 */
Ext.override(Ext.Panel, {
	loadData:function(conf){
		var ct=this;
		//遍历该表单下所有的子项控件，并且为它赋值	
		var setByName=function(container,data){
			var items=container.items;
			if(items!=null){
				for(var i=0;i<items.getCount();i++){
					var comp=items.get(i);
					if(comp.items&&comp.getXType()!='checkboxgroup'){
						setByName(comp,data);
						continue;
					}
					//判断组件的类型，并且根据组件的名称进行json数据的自动匹配
					var xtype=comp.getXType();
					try{
						if(xtype=='textfield' || xtype=='textarea' || xtype=='radio' || xtype=='checkbox' 
							|| xtype=='datefield' || xtype=='combo' || xtype=='hidden' || xtype=='datetimefield'
							||xtype=='htmleditor' || xtype=='numberfield' || xtype=='diccombo'
							|| xtype=='displayfield' || xtype=='fckeditor'
							){
							var name=comp.getName();
							
							if(name){
								if(conf.preName){
									if(name.indexOf(conf.preName)!=-1){
										name=name.substring(conf.preName.length+1);
									}
								}
								var val=eval('data.'+name);
								if(val!=null && val!=undefined){
									comp.setValue(val);
								}
							}
						}
					}catch(e){
						//alert(e);
					}
				}
			}
		};
		if (!ct.loadMask) {
			ct.loadMask = new Ext.LoadMask(Ext.getBody());
			ct.loadMask.show();
		}
		Ext.Ajax.request({
			method:'POST',
			params : conf.params,
			url:conf.url,
			scope:this,
			success:function(response,options){
				var json=Ext.util.JSON.decode(response.responseText);
				var data=null;
				if(conf.root){
					data=eval('json.'+conf.root);
				}else{
					data=json;
				}
				setByName(ct,data);
				if(ct.loadMask){
					ct.loadMask.hide();
					ct.loadMask = null;
				}
				if(conf.success){
				    conf.success.call(ct,response,options);
				}
			},//end of success
			failure:function(response,options){
				if(ct.loadMask){
					ct.loadMask.hide();
					ct.loadMask = null;
				}
				if(conf.failure){
				    conf.failure.call(ct,response,options);
				}
			}
		});
	}
});
/**
 * 修正表单的字段的长度限制的问题
 */
Ext.form.TextField.prototype.size = 20;
Ext.form.TextField.prototype.initValue = function(){
    if(this.value !== undefined){
        this.setValue(this.value);
    }else if(this.el.dom.value.length > 0){
        this.setValue(this.el.dom.value);
    }
    this.el.dom.size = this.size;
    if (!isNaN(this.maxLength) && (this.maxLength *1) > 0 && (this.maxLength != Number.MAX_VALUE)) {
        this.el.dom.maxLength = this.maxLength *1;
    }
};
///**
// * 重写该方法
// */
//Ext.override(Ext.form.ComboBox,{
//	setValue:function(v){
//		var text = v;
//        if(this.valueField){
//            var r = this.findRecord(this.valueField, v);
//            if(r){
//                text = r.data[this.displayField];
//            }else{//自动加载，并且设置其值
//            	var cmb=this;
//            	if(this.getStore){
//	            	this.getStore().load({callback:function(r,options,success){
//	            		cmb.lastSelectionText = text;
//				        if(cmb.hiddenField){
//				            cmb.hiddenField.value = v;
//				        }
//				        Ext.form.ComboBox.superclass.setValue.call(cmb, text);
//				        cmb.value = v;
//	            	}});
//            	}
//            	return this;
//            }
//        }
//        this.lastSelectionText = text;
//        if(this.hiddenField){
//            this.hiddenField.value = v;
//        }
//        Ext.form.ComboBox.superclass.setValue.call(this, text);
//        this.value = v;
//        return this;
//	}
//});
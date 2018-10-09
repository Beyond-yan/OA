/**
 * 部门选择器
 */
var DepSelector4 = {
	/**
	 * @param callback　回调函数
	 * @param isSingle　是否单选
	 */
	getView : function(callback,isSingle,depIds,map,url) {
		
		var collection=new Ext.util.MixedCollection();  
		//向集合中放入已经选择的部门
		if(map!=null){
			map.each(function(key,value,index){   
	       		collection.add(parseInt(key),{id:parseInt(key),name:value});
	    	}); 
		}
	      

		// ---------------------------------start grid
		// panel--------------------------------
		var sm=null;
		if(isSingle){
			var sm=new Ext.grid.CheckboxSelectionModel({singleSelect: true});
		}else{
			sm = new Ext.grid.CheckboxSelectionModel();
		}
		//复选框打勾监听器
		sm.on("rowselect", smRowselectFun, this);
		//复选框取消打勾监听器
		sm.on("rowdeselect", smRowDeselectFun, this);
		
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
								header : 'depId',
								dataIndex : 'depId',
								hidden : true
							}, {
								header : "部门名称",
								dataIndex : 'depName',
								renderer:function(value,metadata,record){
									var str='';
									var level=record.data.depLevel;
									if(level!=null&& !isNaN(level)){
										for(var i=2;i<=level;i++){
											str+='<img src="' + __ctxPath+ '/images/system/down.gif"/>';
										}
									}
									str+=value;
									return str;
								},
								width : 60
							}]
				});

		var store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
							url : url?url : __ctxPath + '/system/selectByDepIdsDepartment.do?depIds=' + depIds 
							}),
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'depId',
								fields : [{
											name : 'depId',
											type : 'int'
										}, 'depName',{name:'depLevel',type:'int'}]
							}),
					remoteSort : true
				});

		var gridPanel = new Ext.grid.GridPanel({
					id : 'DepSelector4Grid',
					width : 400,
					height : 300,
					region : 'center',
					title : '部门列表',
					store : store,
					shim : true,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					cm : cm,
					sm : sm,
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
					},
					// paging bar on the bottom
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});

		store.load({
					params : {
						start : 0,
						limit : 25
					}
				});
		
		
		// --------------------------------end grid
		// panel-------------------------------------
		//复选框打勾后调用的函数
		function smRowselectFun(_sm, _rowIndex, _record) {
			   	var row=gridPanel.getStore().getAt(_rowIndex); 
		        if(_sm.isSelected(_rowIndex)){
		            collection.add(row.get('depId'),{id:row.get('depId'),name:row.get('depName')});	
		        }else
		        {
		        	collection.removeKey(row.get('depId'));
		        }
  
		};
		//复选框取消打勾调用函数
		function smRowDeselectFun(_sm, _rowIndex, _record) {
			var row=gridPanel.getStore().getAt(_rowIndex); 
		        if(_sm.isSelected(_rowIndex)){
		            collection.add(row.get('depId'),{id:row.get('depId'),name:row.get('depName')});	
		        }else
		        {
		        	collection.removeKey(row.get('depId'));
		        }
		};
		store.on('load',function(){
			  var grid = Ext.getCmp('DepSelector4Grid');
			  var total = store.getCount();//数据行数
			   for(var i=0;i<total;i++){
				  var row=store.getAt(i);
				  if(collection.containsKey(row.get('depId'))){
				    //grid.selModel.selectRow(row,true);
				  	sm.selectRecords([row],true);

				  }
			   }  
			  
		},this,{delay:500});
		 //grid.getView().on("refresh", function() {});
		//,this,{delay:1000}
		
		var window = new Ext.Window({
					title : '部门选择器',
					iconCls:'menu-department',
					width : 630,
					height : 380,
					layout:'border',
					border:false,
					items : [gridPanel],
					modal : true,
					buttonAlign : 'center',
					buttons : [{
								iconCls:'btn-ok',
								text : '确定',
								handler : function() {
										var grid = Ext.getCmp('DepSelector4Grid');
										var i = 0;
										var depIds = '';
										var depNames = '';
										//分页复选实现
									    collection.each(
										    function(record){
										     // alert(Ext.encode(record));
										   		if (i > 0) {
													depIds += ',';
													depNames += ',';
												}
												depIds += record.id;
												depNames += record.name;
												i=i+1;
										      }
										  );
										
								
										if (callback != null) {
											callback.call(this, depIds, depNames);
										}
										window.close();
								}
							}, {
								text : '取消',
								iconCls:'btn-cancel',
								handler : function() {
									window.close();
								}
							}]
				});
		return window;
	}

};
JwSentDocsView = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		JwSentDocsView.superclass.constructor.call(this, {
			id : 'JwSentDocsView',
			title : '05年旧发文查询',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},
	initUIComponents : function() {
		this.searchPanel = new HT.SearchPanel({
			layout : 'form',
			region : 'north',
			colNums : 3,
			items : [ {
				fieldLabel : '标题',
				name : 'Q_subject_S_LK',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '文号',
				name : 'Q_docnum_S_LK',
				flex : 1,
				xtype : 'textfield'
			} , {
				fieldLabel : '发文单位',
				name : 'Q_dispatchunit_S_LK',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '拟稿部门',
				name : 'Q_composeunit_S_LK',
				flex : 1,
				xtype : 'textfield'
			} , {
				fieldLabel : '拟稿人',
				name : 'Q_composeuser_S_LK',
				flex : 1,
				xtype : 'textfield'
			} , {
				fieldLabel : '签发',
				name : 'Q_signissuebody_S_LK',
				flex : 1,
				xtype : 'textfield'
			} ],
			buttons : [ {
				text : '查询',
				scope : this,
				iconCls : 'btn-search',
				handler : this.search
			}, {
				text : '重置',
				scope : this,
				iconCls : 'btn-reset',
				handler : this.reset
			} ]
		});

		this.gridPanel = new HT.GridPanel({
			region : 'center',
			id : 'JwSentDocsGrid',
			url : __ctxPath + "/jw/listJwSentDocs.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'unittitle', 'docnum', 'urgencydegree', 'securitydegree',
					'signissuebody', 'signjointlybody', 'todept', 'ccdept',
					'composeunit', 'composeuser', 'checkuser', 'printuser',
					'proofuser', 'dispatchunit', 'docclass', 'docway',
					'attachfilename', 'topic', 'subject', 'attachcode' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '标题',
				dataIndex : 'subject',
				  width:200,
					renderer:function(value, metadata, record, rowIndex,
							colIndex){
						var id=record.data.id;
						var str = '';
						str+='<a href="#"  onclick="JwSentDocsView.detail('
							+ id+')">'+value+'</a>';
						return str;
				}
			},{
				header : '文号',
				dataIndex : 'docnum'
			}, {
				header : '拟稿部门',
				dataIndex : 'composeunit'
			}, {
				header : '拟稿人',
				dataIndex : 'composeuser',
			    width:50
			}, {
				header : '拟稿单位',
				dataIndex : 'composeunit'
			}, {
				header : '文种',
				dataIndex : 'docclass',
			    width:50
			}]
		});
	},
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	search : function() {
		$search({
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new JwSentDocsForm({
				id : rec.data.id
			}).show();
		});
	},
	createRs : function() {
		new JwSentDocsForm().show();
	},
	removeRs : function(id) {
		$postDel({
			url : __ctxPath + '/jw/multiDelJwSentDocs.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	removeSelRs : function() {
		$delGridRs({
			url : __ctxPath + '/jw/multiDelJwSentDocs.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	editRs : function(record) {
		new JwSentDocsForm({
			id : record.data.id
		}).show();
	},
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record.data.id);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		default:
			break;
		}
	}
});
JwSentDocsView.detail= function(id) {
	new JwSentDocsDetailForm({
		id:id
	}).show();
};

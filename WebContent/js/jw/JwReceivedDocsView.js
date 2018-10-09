JwReceivedDocsView = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		JwReceivedDocsView.superclass.constructor.call(this, {
			id : 'JwReceivedDocsView',
			title : '05年旧收文管理',
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
			},{
				fieldLabel : '来文单位',
				name : 'Q_fromunit_S_LK',
				flex : 1,
				xtype : 'textfield'
			},{
				fieldLabel : '收文编号',
				name : 'Q_acceptno_S_LK',
				flex : 1,
				xtype : 'textfield'
			},{
				fieldLabel : '来文字号',
				name : 'Q_docnum_S_LK',
				flex : 1,
				xtype : 'textfield'
			},{
				fieldLabel : '签收人',
				name : 'Q_signname_S_LK',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '成文日期',
				name : 'Q_dispatchdocdt_S_LK',
				flex : 1,
				xtype : 'textfield'
			}],
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
			id : 'JwReceivedDocsGrid',
			url : __ctxPath + "/jw/listJwReceivedDocs.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'unittitle', 'acceptno', 'urgencydegree', 'securitydegree',
					'fromunit', 'subject', 'attachfilename', 'docnum',
					'dispatchdocdt', 'signname', 'topic', 'dept', 'planmemo',
					'planuser', 'plandate', 'leadmemo', 'leadname', 'leaddt',
					'attachcode' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			},{
				header : '标题',
				dataIndex : 'subject',
				width:200,
				renderer:function(value, metadata, record, rowIndex,
						colIndex){
					var id=record.data.id;
					var str = '';
					str+='<a href="#"  onclick="JwReceivedDocsView.detail('
						+ id+')">'+value+'</a>';
					return str;
			}
			}, {
				header : '来文单位',
				dataIndex : 'fromunit'
			},  {
				header : '收文编号',
				dataIndex : 'acceptno'
			}, {
				header : '来文字号',
				dataIndex : 'docnum'
			}, {
				header : '签收人',
				dataIndex : 'signname'
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
			new JwReceivedDocsForm({
				id : rec.data.id
			}).show();
		});
	},
	editRs : function(record) {
		new JwReceivedDocsForm({
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

JwReceivedDocsView.detail= function(id) {
	new JwReciivedDocsDetailForm({
		id:id
	}).show();
};

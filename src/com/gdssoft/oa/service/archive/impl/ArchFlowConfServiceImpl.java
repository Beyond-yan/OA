package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.archive.ArchFlowConfDao;
import com.gdssoft.oa.model.archive.ArchFlowConf;
import com.gdssoft.oa.service.archive.ArchFlowConfService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ArchFlowConfServiceImpl extends BaseServiceImpl<ArchFlowConf> implements ArchFlowConfService{
	private ArchFlowConfDao dao;
	
	public ArchFlowConfServiceImpl(ArchFlowConfDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public ArchFlowConf getByFlowType(Short archType) {
		return dao.getByFlowType(archType);
	}

}
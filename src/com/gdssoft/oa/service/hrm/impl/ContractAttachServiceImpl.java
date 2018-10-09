package com.gdssoft.oa.service.hrm.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.hrm.ContractAttachDao;
import com.gdssoft.oa.model.hrm.ContractAttach;
import com.gdssoft.oa.service.hrm.ContractAttachService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ContractAttachServiceImpl extends BaseServiceImpl<ContractAttach> implements ContractAttachService{
	private ContractAttachDao dao;
	
	public ContractAttachServiceImpl(ContractAttachDao dao) {
		super(dao);
		this.dao=dao;
	}

}
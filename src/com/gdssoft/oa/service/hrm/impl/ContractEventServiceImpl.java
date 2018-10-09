package com.gdssoft.oa.service.hrm.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.hrm.ContractEventDao;
import com.gdssoft.oa.model.hrm.ContractEvent;
import com.gdssoft.oa.service.hrm.ContractEventService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ContractEventServiceImpl extends BaseServiceImpl<ContractEvent> implements ContractEventService{
	private ContractEventDao dao;
	
	public ContractEventServiceImpl(ContractEventDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<ContractEvent> findByContractId(Long contractId) {
		return dao.findByContractId(contractId);
	}
    
	
}
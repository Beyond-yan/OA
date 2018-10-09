package com.gdssoft.oa.dao.hrm.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.hrm.ContractEventDao;
import com.gdssoft.oa.model.hrm.ContractEvent;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ContractEventDaoImpl extends BaseDaoImpl<ContractEvent> implements ContractEventDao{

	public ContractEventDaoImpl() {
		super(ContractEvent.class);
	}

	@Override
	public List<ContractEvent> findByContractId( Long contractId) {
	    String hql = "from ContractEvent ce where ce.userContract.contractId = ?";
		return findByHql(hql,new Object[]{contractId});
	}

}
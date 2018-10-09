package com.gdssoft.oa.service.hrm;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.hrm.ContractEvent;
import com.gdssoft.core.service.BaseService;

public interface ContractEventService extends BaseService<ContractEvent>{
	
	public List<ContractEvent> findByContractId(Long contractId);
}



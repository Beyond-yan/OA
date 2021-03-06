package com.gdssoft.oa.service.hrm;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.hrm.UserContract;
import com.gdssoft.core.service.BaseService;

public interface UserContractService extends BaseService<UserContract>{
	public boolean checkContractNo(String contractNo);
	
	public List<UserContract> findTime(Long contractId);
	
	//提醒合同到期时间
	public void sendContractTime();
}



package com.gdssoft.oa.service.hrm;
/*
 *捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.model.hrm.EmpProfile;
import com.gdssoft.core.service.BaseService;

public interface EmpProfileService extends BaseService<EmpProfile>{

	public boolean checkProfileNo(String profileNo);
	
}



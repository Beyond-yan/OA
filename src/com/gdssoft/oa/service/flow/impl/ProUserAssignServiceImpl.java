package com.gdssoft.oa.service.flow.impl;
/*
 *捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.flow.ProUserAssignDao;
import com.gdssoft.oa.model.flow.ProUserAssign;
import com.gdssoft.oa.service.flow.ProUserAssignService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ProUserAssignServiceImpl extends BaseServiceImpl<ProUserAssign> implements ProUserAssignService{
	private ProUserAssignDao dao;
	
	public ProUserAssignServiceImpl(ProUserAssignDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	public List<ProUserAssign> getByDeployId(String deployId){
		return dao.getByDeployId(deployId);
	}
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.service.flow.ProUserAssignService#getByDeployIdActivityName(java.lang.String, java.lang.String)
	 */
	public ProUserAssign getByDeployIdActivityName(String deployId,String activityName){
		return dao.getByDeployIdActivityName(deployId, activityName);
	}

}
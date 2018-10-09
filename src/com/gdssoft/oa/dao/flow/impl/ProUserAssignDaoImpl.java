package com.gdssoft.oa.dao.flow.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.flow.ProUserAssignDao;
import com.gdssoft.oa.model.flow.ProUserAssign;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ProUserAssignDaoImpl extends BaseDaoImpl<ProUserAssign> implements ProUserAssignDao{

	public ProUserAssignDaoImpl() {
		super(ProUserAssign.class);
	}
	
	public List<ProUserAssign> getByDeployId(String deployId){
		String hql="from ProUserAssign pua where pua.deployId=?";
		return findByHql(hql, new Object[]{deployId});
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.dao.flow.ProUserAssignDao#getByDeployIdActivityName(java.lang.String, java.lang.String)
	 */
	public ProUserAssign getByDeployIdActivityName(String deployId,String activityName){
		String hql="from ProUserAssign pua where pua.deployId=? and pua.activityName=?";
		return (ProUserAssign)findUnique(hql, new Object[]{deployId,activityName});
	}

}
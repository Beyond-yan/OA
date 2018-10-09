package com.gdssoft.oa.service.system.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.dao.system.AppFunctionDao;
import com.gdssoft.oa.model.system.AppFunction;
import com.gdssoft.oa.service.system.AppFunctionService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class AppFunctionServiceImpl extends BaseServiceImpl<AppFunction> implements AppFunctionService{
	private AppFunctionDao dao;
	
	public AppFunctionServiceImpl(AppFunctionDao dao) {
		super(dao);
		this.dao=dao;
	}

	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.service.system.AppFunctionService#getByKey(java.lang.String)
	 */
	public AppFunction getByKey(String key) {
		return dao.getByKey(key);
	}
}
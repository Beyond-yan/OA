package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.system.AppFunctionDao;
import com.gdssoft.oa.model.system.AppFunction;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class AppFunctionDaoImpl extends BaseDaoImpl<AppFunction> implements AppFunctionDao{

	public AppFunctionDaoImpl() {
		super(AppFunction.class);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.dao.system.AppFunctionDao#getByKey(java.lang.String)
	 */
	public AppFunction getByKey(String key){
		String hql="from AppFunction af where af.funKey=?";
		return (AppFunction)findUnique(hql, new String[]{key});
	}

}
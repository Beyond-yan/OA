package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.dao.system.FunUrlDao;
import com.gdssoft.oa.model.system.FunUrl;
import com.gdssoft.oa.service.system.FunUrlService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class FunUrlServiceImpl extends BaseServiceImpl<FunUrl> implements FunUrlService{
	private FunUrlDao dao;
	
	public FunUrlServiceImpl(FunUrlDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.service.system.FunUrlService#getByPathFunId(java.lang.String, java.lang.Long)
	 */
	public FunUrl getByPathFunId(String path,Long funId){
		return dao.getByPathFunId(path, funId);
	}

}
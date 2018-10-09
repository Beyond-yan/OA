package com.gdssoft.oa.service.system;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.model.system.FunUrl;
import com.gdssoft.core.service.BaseService;

public interface FunUrlService extends BaseService<FunUrl>{
	/**
	 * 按path及functionId查找
	 * @param path
	 * @param funId
	 * @return
	 */
	public FunUrl getByPathFunId(String path,Long funId);
}



package com.gdssoft.oa.service.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.model.system.IndexDisplay;
import com.gdssoft.core.service.BaseService;

public interface IndexDisplayService extends BaseService<IndexDisplay>{
	public List<IndexDisplay> findByUser(Long userId);
}



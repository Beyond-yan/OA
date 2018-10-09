package com.gdssoft.oa.dao.info;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.List;

import com.gdssoft.oa.model.info.SuggestBox;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * 
 * @author 
 *
 */
public interface SuggestBoxDao extends BaseDao<SuggestBox>{
	 List<SuggestBox> ggetAll(Object[] param, QueryFilter filter);
	 List<SuggestBox> gListResAll(Object[] param, QueryFilter filter);
}
package com.gdssoft.oa.dao.info;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.info.NewsType;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

public interface NewsTypeDao extends BaseDao<NewsType>{
	public Short getTop();
	public NewsType findBySn(Short sn);
	public List<NewsType> getAllBySn();
	public List<NewsType> getAllBySn(PagingBean pb);
	public List<NewsType> findBySearch(NewsType newsType,PagingBean pb);
}

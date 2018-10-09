package com.gdssoft.oa.dao.info;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.info.News;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

public interface NewsDao extends BaseDao<News>{
	public List<News> findByTypeId(Long typeId,PagingBean pb);

	public List<News> findBySearch(String searchContent,PagingBean pb);
	
	public List<News> findBySearch(String searchContent,Integer auditingStatus,PagingBean pb);
	
	/**
	 * 查找图片新闻
	 * @param pb
	 * @return
	 */
	public List<News> findImageNews(PagingBean pb);
	
 	public List<News> getDaibanNews(AppUser user,PagingBean pb) ;
}

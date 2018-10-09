package com.gdssoft.oa.dao.communicate;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.model.communicate.OutMailUserSeting;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface OutMailUserSetingDao extends BaseDao<OutMailUserSeting>{
	/*
	 * 根据当前登陆人，取得外部邮箱设置
	 */
	public OutMailUserSeting getByLoginId(Long loginid);
}
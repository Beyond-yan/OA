package com.gdssoft.oa.dao.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.text.ParseException;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesMonitor;
import com.gdssoft.oa.model.archive.OdArchivescc;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * 
 * @author 
 *
 */
public interface ArchivesMonitorDao extends BaseDao<ArchivesMonitor>{
	List<ArchivesMonitor> findArchivesMonitor(String schemaCode, String username) throws ParseException;
}

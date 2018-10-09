package com.gdssoft.oa.action.jw;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.jw.JwRecArchives;
import com.gdssoft.oa.model.jw.JwSentArchives;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.service.jw.JwSentArchivesService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;

public class JwSentArchivesAction extends BaseAction
{

  @Resource
  private JwSentArchivesService jwSentArchivesService;

  @Resource
  private SysConfigService sysConfigService;
  private JwSentArchives jwSentArchives;
  private Long id;

  public Long getId()
  {
    return this.id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public JwSentArchives getJwSentArchives() {
    return this.jwSentArchives;
  }

  public void setJwSentArchives(JwSentArchives jwSentArchives) {
    this.jwSentArchives = jwSentArchives;
  }

  public String list()
  {
//    AppUser currentUser = ContextUtil.getCurrentUser();
//    Set<AppRole> roles = currentUser.getRoles();
//    SysConfig isZFZDOfficerID = this.sysConfigService.findByKey("ZFZDOfficerRoleId");
//    boolean isZFZDOfficer = false;
//    if (isZFZDOfficerID != null) {
//      for (AppRole appRole : roles) {
//        if (appRole.getRoleId().toString().equals(isZFZDOfficerID.getDataValue())) {
//          isZFZDOfficer = true;
//        }
//      }
//    }
//    if (currentUser.getIsAdmin().booleanValue()) {
//      isZFZDOfficer = true;
//    }
//    QueryFilter filter = new QueryFilter(getRequest());
//    if (!isZFZDOfficer) {
//      filter.addFilter("Q_rangeFlag_SN_EQ", "0");
//    }
//    List<JwSentArchives> list = this.jwSentArchivesService.getAll(filter);
//    Type type=new TypeToken<List<JwSentArchives>>(){}.getType();
//    StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
//      .append(filter.getPagingBean().getTotalItems()).append(",result:");
//
//    Gson gson = new Gson();
//    buff.append(gson.toJson(list, type));
//    buff.append("}");
	QueryFilter filter=new QueryFilter(getRequest());
	List<JwSentArchives> list= jwSentArchivesService.getAll(filter);
	
	Type type=new TypeToken<List<JwSentArchives>>(){}.getType();
	StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
	.append(filter.getPagingBean().getTotalItems()).append(",result:");
	
	Gson gson=new Gson();
	buff.append(gson.toJson(list, type));
	buff.append("}");
		
    this.jsonString = buff.toString();

    return "success";
  }

  public String multiDel()
  {
    String[] ids = getRequest().getParameterValues("ids");
    if (ids != null) {
      for (String id : ids) {
        this.jwSentArchivesService.remove(new Long(id));
      }
    }

    this.jsonString = "{success:true}";

    return "success";
  }

  public String get()
  {
    JwSentArchives jwSentArchives = (JwSentArchives)this.jwSentArchivesService.get(this.id);

    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();

    StringBuffer sb = new StringBuffer("{success:true,data:");
    sb.append(gson.toJson(jwSentArchives));
    sb.append("}");
    setJsonString(sb.toString());

    return "success";
  }

  public String save()
  {
    if (this.jwSentArchives.getId() == null) {
      this.jwSentArchivesService.save(this.jwSentArchives);
    } else {
      JwSentArchives orgJwSentArchives = (JwSentArchives)this.jwSentArchivesService.get(this.jwSentArchives.getId());
      try {
        BeanUtil.copyNotNullProperties(orgJwSentArchives, this.jwSentArchives);
        this.jwSentArchivesService.save(orgJwSentArchives);
      } catch (Exception ex) {
        this.logger.error(ex.getMessage());
      }
    }
    setJsonString("{success:true}");
    return "success";
  }
}
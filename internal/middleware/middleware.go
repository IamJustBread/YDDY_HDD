package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func VerifyRefererMiddleware(c *gin.Context) {
	referer := c.Request.Header.Get("Referer")
	allowedDomain := "bmath.ru"

	if !strings.Contains(referer, allowedDomain) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Доступ запрещен"})
		c.Abort()
		return
	}

	c.Next()
}
